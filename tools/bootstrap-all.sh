set -e

for d in examples/*/ ; do
    cd $d
    pwd
    # yarn remove warthog || true
    yarn bootstrap
    # yarn codegen
    cd -
done
