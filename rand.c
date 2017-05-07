#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(int argc, char *argv[]){
  int i;
  float a = 50;
  srand((unsigned int)time(NULL));
  printf("var data = [\n");
  for(i=0;i<29;i++)
    printf("[ %f, %f, %d ], \n", ((float)rand()/(float)(RAND_MAX/a))-25, ((float)rand()/(float)(RAND_MAX/a))-25, rand()%50);
  printf("[ %f, %f, %d ] ]", ((float)rand()/(float)(RAND_MAX/a))-25, ((float)rand()/(float)(RAND_MAX/a))-25, rand()%50);
  return 0;
}
