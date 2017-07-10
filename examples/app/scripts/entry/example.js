import './example.css'
import './example2.scss'

function testPromise () {
  new Promise((resolve, reject) => {
    resolve('Promise success')
  })

}
function test () {
}
$(() => {
  console.log('Example build point!123312', STATIC_ROOT, EXAMPLE_DEFINE)

  $('body').click(test)

  testPromise().then(r => {console.log(r)})
})
