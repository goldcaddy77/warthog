// https://github.com/davidkpiano/xstate

import { Machine, interpret } from 'xstate';

// Stateless machine definition
// machine.transition(...) is a pure function used by the interpreter.
const toggleMachine = Machine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } }
  }
});

// Machine instance with internal state
const toggleService = interpret(toggleMachine)
  .onTransition(state => console.log(state.value))
  .start();
// => 'inactive'
