import { SubjectEnum } from "./const";

export type UserType = {
  tgId: number;
  first_name: string;
  username: string;
};

export type ScriptType = {
  greetings: {
    hi: string;
    first: string;
    secondary: string;
  };
  commands: {
    addfact: string;
    addjoke: string;
    fact: string;
    joke: string;
  };
  addFactWiz: {
    onEnter: string;
    onEnd: string;
  };
  addJokeWiz: {
    onEnter: string;
    onEnd: string;
  };
};

export type RecordType = {
  author: string;
  tgId: number;
  text: string;
};