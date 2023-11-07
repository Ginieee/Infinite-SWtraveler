var imageCnt = 0
var image = []

function btnClick() {
	var video = document.querySelector('#videoElement')
	var button = document.querySelector('.camera-button')
	var timerDiv = document.querySelector('.timer-div')

	var text = document.querySelectorAll('.timer')

	button.style.display = 'none'
	timerDiv.style.display = 'grid'
	timerDiv.style.width = video.offsetWidth

	text[0].style.opacity = 1
	setTimeout(function () {
		text[0].style.opacity = 0.5
		text[1].style.opacity = 1
	}, 1000)
	setTimeout(function () {
		text[1].style.opacity = 0.5
		text[2].style.opacity = 1
	}, 2000)
	setTimeout(function () {
		text[2].style.opacity = 0.5
		button.style.display = 'block'
		timerDiv.style.display = 'none'
		captureImage()
	}, 3000)
}

function captureImage() {
	var video = document.querySelector('#videoElement')

	video.classList.add('flash-effect')

	// After a delay, remove the CSS class to stop the flash effect
	setTimeout(function () {
		video.classList.remove('flash-effect')
		video.pause()
		setTimeout(function () {
			video.play()
		}, 500)
	}, 300)

	var canvas = document.createElement('canvas')
	var scale = 0.5
	canvas.width = video.videoWidth * scale
	canvas.height = video.videoHeight * scale
	var context = canvas.getContext('2d')

	context.scale(-1, 1)
	context.drawImage(video, 0, 0, -canvas.width, canvas.height)

	image.push(new Image())
	image[imageCnt].src = canvas.toDataURL('image/png')

	var imageList = document.querySelector('.captured-list')
	var imageContainer = imageList.children[imageCnt]

	imageContainer.replaceChild(image[imageCnt++], imageContainer.children[0])
	imageContainer.className = 'photo'

	if (imageCnt == 4) {
		setTimeout(function () {
			video.pause()

			var webcam = document.querySelector('#webcam')
			webcam.classList.add('fade-out')
			setTimeout(function () {
				video.remove()
				webcam.remove()
			}, 1000)

			var loader = document.querySelector('.spinner')
			loader.style.display = 'block'

			var photo = document.querySelectorAll('.photo-grid .photo')
			for (var i = 0; i < photo.length; i++) {
				photo[i].src = image[i].src
			}
		}, 500)

		setTimeout(function () {
			var loader = document.querySelector('.spinner')
			loader.remove()
			var photoContainer = document.querySelector('.photo-container')
			photoContainer.style.display = 'block'
			var backButton = document.querySelector('.back-button')
			backButton.style.display = 'block'
		}, 2000)
	}
}

function backToGame() {
	window.location.href = '../basic.html'
}
