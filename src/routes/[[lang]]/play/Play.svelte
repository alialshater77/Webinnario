<script lang="ts">
	import * as m from '$paraglide/messages';

	import type {
		AnswerResult,
		TextOrMedia,
		Media,
		IdlessFuizConfig,
		ServerPossiblyHidden
	} from '$lib/types';
	import { onMount } from 'svelte';
	import ChooseName from './ChooseName.svelte';
	import WaitingMobile from './WaitingMobile.svelte';
	import Question from './Question.svelte';
	import Answers from './Answers.svelte';
	import Result from './Result.svelte';
	import WaitingOthers from './WaitingOthers.svelte';
	import Leaderboard from './Leaderboard.svelte';
	import Loading from '$lib/Loading.svelte';
	import { PUBLIC_BACKEND_URL, PUBLIC_WS_URL } from '$env/static/public';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import Bingo from './Bingo.svelte';
	import Winners from './Winners.svelte';
	import { browser } from '$app/environment';
	import Summary from './Summary.svelte';
	import { bring } from '$lib/util';
	import FindTeam from './FindTeam.svelte';
	import ChooseTeammates from './ChooseTeammates.svelte';

	type GameState =
		| {
				WaitingScreen: {
					exact_count: number;
				};
		  }
		| {
				FindTeam: string;
		  }
		| {
				ChooseTeammates: {
					max_selection: number;
					available: [string, boolean][];
				};
		  }
		| {
				NameChoose: {
					sending: boolean;
					error: string;
				};
		  }
		| {
				Summary: {
					score?: {
						points: number;
						position: number;
					};
					points: [number];
					config: IdlessFuizConfig;
				};
		  };

	type SlideState =
		| {
				MultipleChoice: 'QuestionAnnouncment' | 'AnswersAnnouncement' | 'AnswersResults';

				question?: string;
				media?: Media;
				answers?: (TextOrMedia | undefined)[];
				results?: AnswerResult[];
				answered?: number;
		  }
		| {
				Bingo: 'List' | 'Winners';

				all_statements?: {
					id: number;
					text: string;
				}[];
				assigned_statements?: number[];
				crossed?: number[];
				user_votes?: number[];

				winners?: string[];
		  }
		| {
				Score: {
					points: number;
					position: number | undefined;
				};
		  };

	type State =
		| {
				Game: GameState;
		  }
		| {
				index: number;
				count: number;
				score: number;
				Slide: SlideState;
		  }
		| {
				Error: string;
		  };

	type NamesError = 'Used' | 'Assigned' | 'Empty' | 'Sinful' | 'TooLong';

	type GameIncomingMessage =
		| { IdAssign: string }
		| {
				WaitingScreen: {
					exact_count: number;
				};
		  }
		| {
				FindTeam: string;
		  }
		| {
				ChooseTeammates: {
					max_selection: number;
					available: [string, boolean][];
				};
		  }
		| {
				Score: {
					index?: number;
					count?: number;
					score?: {
						points: number;
						position: number;
					};
				};
		  }
		| 'NameChoose'
		| {
				NameAssign: string;
		  }
		| {
				NameError: NamesError;
		  }
		| {
				Metainfo: {
					Player: {
						score: number;
						show_answers: boolean;
					};
				};
		  }
		| {
				Summary: {
					Player: {
						score?: {
							points: number;
							position: number;
						};
						points: [number];
						config: IdlessFuizConfig;
					};
				};
		  };

	type MultipleChoiceIncomingMessage =
		| {
				QuestionAnnouncment: {
					index: number;
					count: number;
					question: string;
					media?: Media;
					duration: number;
				};
		  }
		| {
				AnswersAnnouncement: {
					index?: number;
					count?: number;
					question?: string;
					media?: Media;
					answers: Array<ServerPossiblyHidden<TextOrMedia>>;
					answered_count?: number;
					duration: number;
				};
		  }
		| {
				AnswersResults: {
					index?: number;
					count?: number;
					question?: string;
					media?: Media;
					answers: Array<TextOrMedia>;
					results: Array<AnswerResult>;
				};
		  };

	type BingoIncomingMessage =
		| {
				List: {
					index: number;
					count: number;
					all_statements: {
						id: number;
						text: string;
					}[];
					assigned_statements: number[];
					crossed: number[];
					user_votes: number[];
				};
		  }
		| {
				Cross: {
					crossed: number[];
				};
		  }
		| {
				Votes: {
					user_votes: number[];
				};
		  }
		| {
				Winners: {
					index?: number;
					count?: number;
					winners: string[];
				};
		  };

	type IncomingMessage =
		| {
				Game: GameIncomingMessage;
		  }
		| {
				MultipleChoice: MultipleChoiceIncomingMessage;
		  }
		| {
				Bingo: BingoIncomingMessage;
		  };

	let currentState: State | undefined = undefined;

	let socket: WebSocket;

	let setName: string | undefined = undefined;

	let points: number | undefined = undefined;

	export let code: string;

	let finished = false;

	let leaderboardName = '';

	let showAnswers = false;

	let watcherId = (browser && localStorage.getItem(code + '_play')) || undefined;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WS_URL + '/watch/' + code);
		setName = undefined;

		// // Listen for messages
		socket.addEventListener('message', (event) => {
			let newMsg: IncomingMessage = JSON.parse(event.data);

			let {
				index: previousIndex = 0,
				count: previousCount = 1,
				score: previousScore = points || 0
			} = currentState && 'Slide' in currentState ? currentState : {};

			if ('Game' in newMsg) {
				if (newMsg.Game === 'NameChoose') {
					currentState = {
						Game: {
							NameChoose: {
								sending: false,
								error: ''
							}
						}
					};
				} else if ('NameAssign' in newMsg.Game) {
					currentState = undefined;
					setName = newMsg.Game.NameAssign;
				} else if ('NameError' in newMsg.Game) {
					let errorMessage = '';
					if (newMsg.Game.NameError === 'Used') {
						errorMessage = m.in_use();
					} else if (newMsg.Game.NameError === 'Assigned') {
						errorMessage = m.have_name();
					} else if (newMsg.Game.NameError === 'Empty') {
						errorMessage = m.cannot_empty();
					} else if (newMsg.Game.NameError === 'Sinful') {
						errorMessage = m.inappropriate();
					} else if (newMsg.Game.NameError === 'TooLong') {
						errorMessage = m.too_long();
					}
					currentState = {
						Game: {
							NameChoose: {
								sending: false,
								error: errorMessage
							}
						}
					};
				} else if ('Score' in newMsg.Game) {
					let {
						index = previousIndex,
						count = previousCount,
						score: { points, position } = {
							points: previousScore,
							position: undefined
						}
					} = newMsg.Game.Score;

					currentState = {
						index,
						count,
						score: points,
						Slide: {
							Score: {
								points,
								position
							}
						}
					};
				} else if ('WaitingScreen' in newMsg.Game) {
					let { exact_count } = newMsg.Game.WaitingScreen;
					currentState = {
						Game: {
							WaitingScreen: {
								exact_count
							}
						}
					};
				} else if ('IdAssign' in newMsg.Game) {
					watcherId = newMsg.Game.IdAssign;
					localStorage.setItem(code + '_play', watcherId);
				} else if ('Metainfo' in newMsg.Game) {
					let { score, show_answers } = newMsg.Game.Metainfo.Player;
					points = score;
					showAnswers = show_answers;
				} else if ('Summary' in newMsg.Game) {
					finished = true;
					currentState = {
						Game: {
							Summary: newMsg.Game.Summary.Player
						}
					};
					socket.close();
				} else if ('FindTeam' in newMsg.Game) {
					currentState = {
						Game: {
							FindTeam: newMsg.Game.FindTeam
						}
					};
					leaderboardName = newMsg.Game.FindTeam;
				} else if ('ChooseTeammates' in newMsg.Game) {
					currentState = {
						Game: {
							ChooseTeammates: newMsg.Game.ChooseTeammates
						}
					};
				}
			} else if ('MultipleChoice' in newMsg) {
				let mc = newMsg.MultipleChoice;

				let previous_state =
					currentState && 'Slide' in currentState && 'MultipleChoice' in currentState.Slide
						? currentState.Slide
						: undefined;

				if ('QuestionAnnouncment' in mc) {
					let { index, count, question, media } = mc.QuestionAnnouncment;
					currentState = {
						index,
						count,
						score: previousScore,
						Slide: {
							MultipleChoice: 'QuestionAnnouncment',
							question,
							media
						}
					};
				} else if ('AnswersAnnouncement' in mc) {
					let {
						index = previousIndex,
						count = previousCount,
						question = previous_state?.question,
						media = previous_state?.media,
						answers
					} = mc.AnswersAnnouncement;
					currentState = {
						index,
						count,
						score: previousScore,
						Slide: {
							MultipleChoice: 'AnswersAnnouncement',
							question,
							media,
							answers: answers.map((a) => {
								if (a === 'Hidden') return undefined;
								return a.Visible;
							})
						}
					};
				} else if ('AnswersResults' in mc) {
					let {
						index = previousIndex,
						count = previousCount,
						question = previous_state?.question,
						media = previous_state?.media,
						answers,
						results
					} = mc.AnswersResults;
					currentState = {
						index,
						count,
						score: previousScore,
						Slide: {
							MultipleChoice: 'AnswersResults',
							question,
							media,
							answers,
							results,
							answered: previous_state?.answered
						}
					};
				}
			} else if ('Bingo' in newMsg) {
				let bingo = newMsg.Bingo;

				let previousState =
					currentState && 'Slide' in currentState && 'Bingo' in currentState.Slide
						? currentState.Slide
						: undefined;

				if ('List' in bingo) {
					let { index, count, all_statements, assigned_statements, crossed, user_votes } =
						bingo.List;
					currentState = {
						index,
						count,
						score: previousScore,
						Slide: {
							Bingo: 'List',
							all_statements,
							assigned_statements,
							crossed,
							user_votes
						}
					};
				} else if ('Winners' in bingo) {
					let { index = previousIndex, count = previousCount, winners } = bingo.Winners;
					currentState = {
						index,
						count,
						score: previousScore,
						Slide: {
							Bingo: 'Winners',
							winners
						}
					};
				} else if ('Cross' in bingo) {
					let { crossed } = bingo.Cross;
					currentState = {
						index: previousIndex,
						count: previousCount,
						score: previousScore,
						Slide: {
							...previousState,
							Bingo: 'List',
							crossed
						}
					};
				} else if ('Votes' in bingo) {
					let { user_votes } = bingo.Votes;
					currentState = {
						index: previousIndex,
						count: previousCount,
						score: previousScore,
						Slide: {
							...previousState,
							Bingo: 'List',
							user_votes
						}
					};
				}
			}
		});

		socket.addEventListener('close', async () => {
			if (!(currentState && 'Error' in currentState) && !finished) {
				const res = await bring(PUBLIC_BACKEND_URL + '/alive/' + code, {
					method: 'GET',
					mode: 'cors'
				});
				if (res === undefined) {
					currentState = {
						Error: m.connection_closed()
					};
				} else {
					let text = await res.text();
					if (text === 'true') {
						location.reload();
					} else {
						currentState = {
							Error: m.game_ended()
						};
					}
				}
			}
		});

		socket.addEventListener('open', () => {
			if (watcherId === undefined) {
				socket.send(JSON.stringify({ Ghost: 'DemandId' }));
			} else {
				socket.send(JSON.stringify({ Ghost: { ClaimId: watcherId } }));
			}
		});

		socket.addEventListener('error', () => {
			currentState = {
				Error: m.code_not_exist()
			};
		});
	});

	$: name = (leaderboardName ? leaderboardName + ' - ' : '') + setName || m.you();

	function requestName(name: string) {
		currentState = {
			Game: {
				NameChoose: {
					sending: true,
					error: ''
				}
			}
		};
		socket.send(JSON.stringify({ Unassigned: { NameRequest: name } }));
	}

	function sendAnswer(index: number) {
		if (currentState && 'Slide' in currentState && 'MultipleChoice' in currentState.Slide) {
			currentState = {
				...currentState,
				Slide: {
					...currentState.Slide,
					answered: index
				}
			};
		}

		socket.send(JSON.stringify({ Player: { IndexAnswer: index } }));
	}

	function sendVote(index: number) {
		socket.send(JSON.stringify({ Player: { IndexAnswer: index } }));
	}

	function sendChooseTeammate(names: string[]) {
		socket.send(JSON.stringify({ Player: { ChooseTeammates: names } }));
	}
</script>

{#if currentState === undefined}
	<Loading />
{:else if 'Error' in currentState}
	<ErrorPage errorMessage={currentState.Error} />
{:else if 'Game' in currentState}
	{@const game = currentState.Game}
	{#if 'NameChoose' in game}
		{@const { sending, error: errorMessage } = game.NameChoose}
		<ChooseName on:setName={(x) => requestName(x.detail)} {sending} {errorMessage} />
	{:else if 'WaitingScreen' in game}
		<WaitingMobile {name} gameCode={code} />
	{:else if 'Summary' in game}
		{@const { score, points, config } = game.Summary}
		<Summary {score} {points} {config} />
	{:else if 'FindTeam' in game}
		<FindTeam {name} gameCode={code} teamName={game.FindTeam} />
	{:else if 'ChooseTeammates' in game}
		<ChooseTeammates
			{name}
			gameCode={code}
			max={game.ChooseTeammates.max_selection - 1}
			available={game.ChooseTeammates.available.filter(([name]) => name !== setName)}
			on:choose={(e) => sendChooseTeammate(e.detail)}
		/>
	{/if}
{:else if 'Slide' in currentState}
	{@const { Slide: slide, index, count, score } = currentState}
	{#if 'MultipleChoice' in slide}
		{@const { MultipleChoice: kind, question, answers, media, results, answered } = slide}
		{#if kind === 'QuestionAnnouncment'}
			<Question {name} {score} {media} questionText={question || ''} />
		{:else if kind === 'AnswersAnnouncement'}
			{#if answered === undefined}
				<Answers
					on:answer={(e) => sendAnswer(e.detail)}
					questionText={question || ''}
					{media}
					{name}
					{score}
					{showAnswers}
					answers={answers || []}
				/>
			{:else}
				<WaitingOthers {name} {score} />
			{/if}
		{:else if kind === 'AnswersResults'}
			<Result
				{name}
				{score}
				correct={answered === undefined ? false : results?.at(answered)?.correct || false}
			/>
		{/if}
	{:else if 'Score' in slide}
		{@const { points, position } = slide.Score}
		<Leaderboard {name} score={points} {position} final={index + 1 === count} />
	{:else if 'Bingo' in slide}
		{@const {
			Bingo: kind,
			all_statements: allStatements,
			assigned_statements: assignedStatements,
			crossed,
			user_votes: userVotes,
			winners
		} = slide}
		{#if kind === 'List'}
			<Bingo
				{name}
				{score}
				crossed={crossed || []}
				allStatements={allStatements || []}
				userVotes={userVotes || []}
				assignedStatements={assignedStatements || []}
				on:index={(e) => sendVote(e.detail)}
			/>
		{:else if kind === 'Winners'}
			<Winners {name} {score} winners={winners || []} isWinner={winners?.includes(name) || false} />
		{/if}
	{/if}
{/if}
