var gulp = require('gulp');
var replace = require('gulp-replace');
 
gulp.task('dev', function(){
    return gulp.src(['src/env/env.json'])
      .pipe(replace("http://192.168.4.1/Concentration_pm", "http://localhost:32769/Concentration_pm"))
      .pipe(gulp.dest('src/env'));
  });

gulp.task('test', function(){
    return gulp.src(['src/env/env.json'])
    .pipe(replace("http://localhost:32769/Concentration_pm", "http://192.168.4.1/Concentration_pm"))
    .pipe(gulp.dest('src/env'));
});