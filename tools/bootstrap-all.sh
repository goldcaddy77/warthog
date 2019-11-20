set -e

for d in examples/*/
do
    cd $d
    pwd
    # yarn upgrade && npx syncyarnlock -s -k && yarn
    # rm -rf generated
    # yarn db:drop
    yarn bootstrap
    # yarn codegen
    cd -
done
