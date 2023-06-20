#!/bin/bash

echo "Selecting template for using";
echo "CONCURENCY UNITS IS "$CONCURENCY_UNITS;
if [ "$CONCURENCY_UNITS" -le "0" ]
then
    mv ./templates/template_no_pk.yaml ./templates/template.yaml;
else
    mv ./templates/template_with_pk.yaml ./templates/template.yaml;
fi
mv ./templates/template.yaml .;
echo "Template selected.";
