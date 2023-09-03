/*
Methods parser chain will have two main paramethers

Next -> That will be the link for the next element in the chain 
Prev -> The prev will be the same but oposite

This way the Chain can make an solid link making an big memory saving process

{
    Next: [Statement, obj] -> link to next // Case end = null
    Prev: [Statement, obj] -> Link to previous // Case first = null
}

null -> Stmnt -> Stmnt -> Stmnt -> null

This help with the recursivity and memory efficience just passing the element position reference 
and not passing the entire object itself

null -> Stmnt -> Stmnt -> ...
        -> Need an call (So if need to parse again recursively from the beggining we dont pass another 
            instance just use the reference of the already instantied one, saving memory and the speed)
        null -> Stmnt -> Stmnt -> ...
*/ 