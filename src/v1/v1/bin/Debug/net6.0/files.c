#include <stdio.h>
#include <stdlib.h>

int main()
{
    //1
    FILE *filePointer;
    char ch;

    //2
    filePointer = fopen("example.txt", "r");

    //3
    if (filePointer == NULL)
    {
        printf("File is not available \n");
    }
    else
    {
        //4
        while ((ch = fgetc(filePointer)) != EOF)
        {
            printf("%c", ch);
        }
    }

    //5
    fclose(filePointer);

    return 0;
}