/*
-----------------------------------------------------

OAK Package Manager

-----------------------------------------------------

main file

commands:

    oak init 
    1- project name
    2- project description
    3- project version
    4- project author
    5- project license
    6- project repository
        - create project/oak.json file
        - create project/src folder
        - create project/src/main.dyd file
        - create project/oak_modules folder
        - create project/oak_modules/externals folder
        - create project/oak_modules/oakdata folder


        tree:

        project
        ├── oak.json
        ├── oak_modules
        │   ├── externals
        │   └── oakdata
        └── src
            └── main.dyd

    
        oak.json:

        {
            "name": "project",
            "description": "project description",
            "version": "0.0.1",
            "author": "project author",
            "license": "project license",
            "repository": "project repository",
            "main": "src/main.dyd,
            "dependencies": [
                {"externals": ""}
            ]
        }



*/ 


