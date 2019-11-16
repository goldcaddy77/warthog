set -e

for d in examples/*/ ; do
    cd $d
    pwd
    rm -rf generated
    yarn db:drop
    yarn bootstrap
    cd -
done
