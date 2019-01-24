# This app

I combine my favourite parts of Duolingo and Quizlet to create an app for
pro learners.

I am in this process also discovering the best ways to learn a language using
tools. To this end one of the most important goals for the tool is that it is
configurable and has a low cost of change (in the end, the logical conclusion
for lowering the cost of change is implementing configurability).

Thoughts on language learning:
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
- I am not a skilled Georgian speaker, so I will start off by serving other
people's lessons through this interface.

# Configuration

config/ has a script you can run as `q create_env_configuration_script.q`. This
produces a file `config/apprc`. If you then run `source apprc`, it will set a bunch
of project specific environment variables so that all the parts can work together
on the same machine in a fully configurable manner.

`apprc` is produced using the actual configuration file: `config/cfg`.
There is an example containing all of the required variables, called
`config/cfg.example`.

After a few weeks of always forgetting to load the variables, I added
`. "<path to this project>/config/apprc"` to my `~/.profile` (semantically
speaking).

```
"Don't forget, a couple of hours of trial and error can save you several minutes
of reading the README."
- Unknown
```

# Dependencies

Q (3.5)
Neo4j (3.5)
Python3 (3.6)
Go (1.11)
Yarn (1.12)
Node (10.11)
Kotlin (1.3)

# Big plans

## Adaptive UI

Get UI parameters like the position of buttons on the screen and stuff from the
server on data fetches. Track UI interactions. Feed data through a server-side
model. Update what new visitors see based on this. Over time, the UI evolves to
become more effective at getting users towards the user stories they are
achieving.

## UI interaction tracking

Separate Q server for tracking UI interactions.

# Content creation

UI for submitting lesson plans - which are producers(functions which return
questions) and their corresponding inputs. Completely configurable - can be used
to create maths questions, vocab questions or programming questions.

# Seperation of learning from practice

Learning something for the first time is different from practicing it later.
There should be different exercises for learning something for the first time
and for revisiting a topic later.

# Actually delivering features again instead of pissing about

Hm
