export interface Chapter {
	name: string;
	url: string;
}

export interface Question {
	id: number;
	question: string;
	options: {
		[key: string]: string;
	};
	correct_answer: string;
	explanation: string;
}

export interface ResultItem extends Question {
	userAnswer: string | undefined;
	isCorrect: boolean;
	correctAnswer: string;
	everWrong?: boolean;
	// for practice review
}

export type ExamState =
	| "setup"
	| "running_practice"
	| "running_exam"
	| "practice_review"
	| "practice_completed"
	| "finished";
