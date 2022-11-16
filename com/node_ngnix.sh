cd /d/kmoyu/VueNode/fe

dir='/d/nginx-1.20.2/'
nhtml="$dir/html/"
# ls yourdir 2>/dev/null||mkdir yourdir
if [ ! -d "$nhtml" ]
then
    echo "File doesn't exist. Creating now"
    mkdir -p $nhtml
    echo "File created"
else
    rm -rf "$nhtml"*
    echo "File exists and rm the dir"
fi
cp -rf dist/* $nhtml

cd $dir
cmd "/C start nginx.exe"