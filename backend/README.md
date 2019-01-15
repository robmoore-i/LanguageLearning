# Legacy Backend

I decided I wanted to learn Go so I wrote the backend in Go. I never got familiar
with unit testing and so everything is covered by the python integration tests.

I then decided I wanted to do more Kotlin. This is also good practice for migrating
legacy backends in general. The port this legacy server runs on is configured by
environment variable, and the new server redirects all unimplemented endpoints to
here while I rewrite the functionality.
