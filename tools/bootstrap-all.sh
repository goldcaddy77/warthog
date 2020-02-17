set -e

yarn
yarn build

for d in examples/*/
do
    cd $d
    pwd
    yarn bootstrap
    # yarn codegen
    cd -
done
