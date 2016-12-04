import './example.css'
function test() {
    console.log(3);
}
$(() => {
    console.log('Example build point!123312');

    $('body').click(test);

});
