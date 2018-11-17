# Learning frontend

Why not

# Doing some TDD with React

Fun and helps me understand what to aim for when working with the various
*interesting* react design patterns I find out in the wild.

# This app

I combine my favourite parts of Duolingo and Quizlet to create an app for
pro learners. Or something.

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
Npm (6.4.1)
Node (10.11.0)

## Name

As always I have plucked a spicy name out of the air. Melange is the name of
the geriatric spice from Frank Herbert's Dune series. It lets you live longer
and see the future.

## Big plans

### Adaptive UI

Get UI parameters like the position of buttons on the screen and stuff from the
server on data fetches. Track UI interactions. Feed data through a server-side
model. Update what new visitors see based on this. Over time, the UI evolves to
become more effective at getting users towards the user stories they are
achieving.

### UI interaction tracking

Separate Q backend for tracking UI interactions.

### Content creation

UI for submitting lesson plans - which are producers(functions which return
questions) and their corresponding inputs. Completely configurable - can be used
to create maths questions, vocab questions or programming questions.

### PWA stuff

// ToGoogle (or duckduckgo...)
