set -e

for d in examples/*/ ; do
    cd $d
    # yarn remove warthog || true
    yarn bootstrap
    cd -
done
