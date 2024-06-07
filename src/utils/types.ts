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
