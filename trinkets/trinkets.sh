function frontend_src_files {
    ls frontend/src/main/*.js frontend/src/index.js
}

function frontend_test_files {
    ls frontend/src/test/*.js frontend/src/test/unit/*.test.js frontend/src/test/integration/*.test.js
}

function frontend_stylesheets {
    ls frontend/src/styles/*.css
}

function frontend_images {
    ls frontend/src/images/
}

function backend_src_files {
    ls backend/src/*.go
}

function backend_test_files {
    ls backend/test/test.py
}

function db_init_scripts {
    ls database/courses/*.cql
}

function db_images {
    ls database/images/
}

function db_extracts {
    ls database/extracts/
}

$1
