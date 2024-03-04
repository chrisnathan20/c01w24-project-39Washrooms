#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(){

    char first[] = "Monday";
    char* second = "Tuesday";
    char* third =  malloc(sizeof(char)*10);
    strncpy(third, "Wednesday", 10);
    //printf("done");

    first[3] = '\0';
    third[3] = '\0';

    printf("%s\n", first);
    printf("%s\n", second);
    printf("%s\n", third);

    char** arrayList= malloc(sizeof(char*)*3);
    arrayList[0] = first;
    arrayList[1] = second;
    arrayList[2] = third;

    free(third);
    free(arrayList);

    return 0;

    //tuesday cant be changed because its a str literal stored in ROM

   


    

}