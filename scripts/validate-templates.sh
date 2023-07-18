
#!/bin/bash

templates_dir="infrastructure"
exit_code=0

for dir in "$templates_dir"/*; do
  if [[ -d "$dir" ]]; then
    sam validate --lint -t "$dir/template.yaml"

    if [[ $? -ne 0 ]]; then
      exit_code=1
    fi
  fi
done

exit $exit_code
