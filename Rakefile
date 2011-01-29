#
# Mostly taken from the jQuery project. 
# See http://github.com/jquery/jquery/blob/master/Rakefile
# Thanks! :-)

prefix = File.dirname( __FILE__ )

# Directory variables
src_dir = File.join( prefix, 'src' )
build_dir = File.join( prefix, 'build' )
dep_dir = File.join( prefix, 'dependencies' )

# A different destination directory can be set by
# setting DIST_DIR before calling rake
dist_dir = ENV['DIST_DIR'] || File.join( prefix, 'dist' )

base_files = %w{intro ImageColorPicker outro}.map { |js| File.join( src_dir, "#{js}.js" ) }

jq = File.join( dist_dir, "jquery.ImageColorPicker.js" )
jq_min = File.join( dist_dir, "jquery.ImageColorPicker.min.js" )

# General Variables
date = `git log -1`[/^Date:\s+(.+)$/, 1]
version = File.read( File.join( prefix, 'version.txt' ) ).strip

# Build tools
rhino = "java -jar #{build_dir}/js.jar"
minfier = "java -jar #{build_dir}/google-compiler-20091218.jar"

# Turn off output other than needed from `sh` and file commands
verbose(false)

# Tasks
task :default => "min"


desc "Builds a minified version of the ImageColorPicker Plugin: jquery.ImageColorPicker.min.js"
task :min => jq_min


desc "Removes dist folder"
task :clean do
  puts "Removing Distribution directory: #{dist_dir}..."
  rm_rf dist_dir
end

desc "Tests built jquery.ImageColorPicker.js against JSLint"
task :lint => jq do
  puts "Checking jQuery.ImageColorPicker.js against JSLint..."
  sh "#{rhino} " + File.join(build_dir, 'jslint-check.js')
end


# File and Directory Dependencies
directory dist_dir

file jq => [dist_dir, base_files].flatten do
	puts "Copying CSS file..."
  sh "cp #{src_dir}/ImageColorPicker.css #{dist_dir}"
  
  puts "Copying JS dependencies..."
  sh "cp #{dep_dir}/jquery-1.4.4.min.js #{dist_dir}"
  sh "cp #{dep_dir}/jquery-ui-1.8.9.custom.min.js #{dist_dir}"

  puts "Building jquery.ImageColorPicker.js..."  
  
  File.open(jq, 'w') do |f|
    f.write cat(base_files).gsub(/(Date:.)/, "\\1#{date}" ).gsub(/@VERSION/, version)
  end
end

file jq_min => jq do
  puts "Building jquery.ImageColorPicker.min.js..."

  sh "#{minfier} --js #{jq} --warning_level QUIET --js_output_file #{jq_min}"
  
  min = File.read( jq_min )
  
  # Equivilent of "head"
  File.open(jq_min, 'w') do |f|
    f.write File.readlines(jq)[0..11].join()
    f.write min
  end
end

def cat( files )
  files.map do |file|
    File.read(file)
  end.join('')
end
