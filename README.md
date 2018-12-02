# Learning frontend

Why not.

3 month-ish update: Writing object oriented, loosely coupled javascript is not
rocket science.

# Doing some TDD with React

Fun and helps me understand what to aim for when working with the various
*interesting* react design patterns I find out in the wild.

3 month-ish update: TDD using enzyme/react is a joy.

# This app

I combine my favourite parts of Duolingo and Quizlet to create an app for
pro learners. Or something.

I am in this process also discovering the best ways to learn a language using
tools. To this end one of the most important goals for the tool is that it is
configurable and has a low cost of change (the same thing is a way, no?)

Current thoughts:
- I want to be able to describe the world in a new language.
- But only when I'm thinking about the fact that I want that.
- I am usually thinking about how I'd like to be able to do that while I'm
learning to do that.
- While I'm learning a language I'm usually in one of two places: At my desk
at home or on the train to work.
- Actions 1 => Teach sentences early which enable learners to describe their
immediate surroudings and generally things they are thinking of while they
are learning.
- Actions 2 => I want the complexity of the things I can say to build
vertically as well as  horizontally. I don't just want to be able to say
"I like X" for all X. I would go as far as to say that, like quality in the
sand cone tradeoff model, sentence complexity must be built on before
expanding horizontally. Aka: Constructions > Vocabulary. However vocabulary is
necessary to make sufficient use of further constructions to feel as though my
skill is advancing, so they must be balanced.

# Configuration

config/ has a script you can run as `q create_env_configuration_script.q`. This
produces a file `config/melangerc`. If you then run `source melangerc`, it will set a bunch
of project specific environment variables so that all the parts can work together
on the same machine in a fully configurable manner.

`melangerc` is produced using the actual configuration file: `config/cfg`.
There is an example containing all of the required variables, called
`config/cfg.example`.

# Dependencies

Name of thing (the version I am using)

Q (3.5)
Neo4j (3.4.9)
Python3 (3.5.2)
Go (1.11.1)
Yarn (1.12.3)
Npm (6.4.1)
Node (10.11.0)

# Name

As always I have plucked a spicy name out of the air. Melange is the name of
the geriatric spice from Frank Herbert's Dune series. It lets you live longer
and see the future. I'll change this to be some pronouncable word in Georgian
at some point, but for now the repo is callled LanguageLearning because its
a work in progress.

# Big plans

## Adaptive UI

Get UI parameters like the position of buttons on the screen and stuff from the
server on data fetches. Track UI interactions. Feed data through a server-side
model. Update what new visitors see based on this. Over time, the UI evolves to
become more effective at getting users towards the user stories they are
achieving.

## UI interaction tracking

Separate Q backend for tracking UI interactions.

# Content creation

UI for submitting lesson plans - which are producers(functions which return
questions) and their corresponding inputs. Completely configurable - can be used
to create maths questions, vocab questions or programming questions.
