document.addEventListener('DOMContentLoaded', () => {
    const h3Element = document.querySelector('.intro-message .quote-container h3');
    const text = h3Element.textContent.trim(); // Get the original text and trim extra spaces
    const words = text.split(" "); // Split the text into words
    let index = 0;
    const speed = 500; // Speed to reveal each word (milliseconds)

    h3Element.innerHTML = ''; // Clear the h3 content before typing starts

    // Wrap each word in a span and append it to h3Element
    words.forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + ' '; // Add space after each word
        h3Element.appendChild(span);
    });

    const spans = h3Element.querySelectorAll('span'); // Select all span elements
    console.log(h3Element.children.length)

    function revealWord() {
        if (index < spans.length) {
            spans[index].style.opacity = 1; // Reveal the word by changing opacity
            index++;
            setTimeout(revealWord, speed); // Delay between each word reveal
        }
    }

    setTimeout(revealWord, 1000); // Optional delay before starting the animation
});

//-----------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('header .right-header ul li');
    const sections = document.querySelectorAll('main section');

    const PlayBtn = document.querySelector('.control button');
    const playIcons = document.querySelectorAll('.overlay button');

    let currentAudio = null;
    let currentSong = null;
    let currentSongIndex = 0;
    
    const musik = 'music2.mp3';
    const music = 'music.mp3';
    const Lyrics =  document.querySelector('.lyrics');
    const bio = document.querySelector('.bio');
    const song = new Audio(music);
    const newSong = new Audio(musik);

    let isPlaying = false;
    let isAudioPlaying = false;

    const voiceBtn = document.querySelectorAll('.narration-button button');
    let currentVoice = null;

    links[0].classList.add('active');

    const toggleSections = (showIndex, hideIndex) => {
        sections[hideIndex].style.display = 'none';
        sections[showIndex].style.display = 'flex';
        links[hideIndex].classList.remove('active');
        links[showIndex].classList.add('active');

        if(!sections[1].classList.contains('active')) {
            if (currentSong && !currentSong.paused) {
                currentSong.pause();
                PlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                isPlaying = false;
            }

            if(currentVoice && !currentVoice.paused) {
                currentVoice.pause();
                playIcons.forEach(p => {p.innerHTML = '<i class="fas fa-play"></i>';})
                isPlaying = false;
            }
        }

        if(!sections[0].classList.contains('active')){
            if(currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                playIcons.forEach(p => { p.innerHTML = '<i class="fas fa-play"></i>'});
                currentAudio.currentTime = 0;
                isAudioPlaying = false;
            }
        }
    };

    links[0].addEventListener('click', () => toggleSections(0, 1));
    links[1].addEventListener('click', () => toggleSections(1, 0));

    
    
    voiceBtn[0].addEventListener('click', (event) => {
        const maleVoice = 'male.mp3';
        event.target.classList.add('active');
        voiceBtn[1].classList.remove('active');
        playVoice(maleVoice);
    });
    
    voiceBtn[1].addEventListener('click', (event) => {
        const femaleVoice = 'female.mp3';
        event.target.classList.add('active');
        voiceBtn[0].classList.remove('active');
        playVoice(femaleVoice);
    });
    
    function playVoice(voice) {
        const audio = new Audio(voice);
    
        if (currentVoice && !currentVoice.paused) {
            currentVoice.pause();
        }
    
        if (currentVoice && currentVoice !== audio) {
            currentVoice.pause();
        }
    
        currentVoice = audio;
        currentVoice.play();
        showActiveP();

        currentVoice.addEventListener('ended', () => {
            voiceBtn[0].classList.remove('active');
            voiceBtn[1].classList.remove('active');
        });
    }
    
    function showActiveP() {
        const allPs = document.querySelectorAll('.tex-narration p');
    
        allPs.forEach(p => p.classList.remove('active')); // Remove 'active' from all paragraphs
        
        let index = 0;
        
        function activateNextP() {
            if (index < allPs.length) {
                const p = allPs[index];
                const duration = parseInt(p.getAttribute('data-duration')) * 1000; // Convert to milliseconds
                
                p.classList.add('active');
                p.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    p.classList.remove('active');
                    index++;
                    activateNextP(); // Move to the next p element after the duration
                }, duration);
            }
        }
    
        activateNextP(); // Start the process
    }
    
    PlayBtn.addEventListener('click', () => {

        if(currentSong && currentSong !== song) {
            currentSong.pause();
        }

        if(currentVoice && !currentVoice.paused) {
            currentVoice.pause();
            voiceBtn[0].classList.remove('active');
            voiceBtn[1].classList.remove('active');
        }

        // If the song is currently playing, pause it
        if (isPlaying) {
            currentSong.pause();
            PlayBtn.innerHTML = '<i class="fas fa-play"></i>';  // Switch to play icon
            isPlaying = false;  // Set playing state to false
            bio.style.display = 'none';  // Show the bio when paused
        } else {
            // If the song is paused or not yet started, play it
            currentSong = song;  // Assign the current song
            currentSong.play();
            PlayBtn.innerHTML = '<i class="fas fa-pause"></i>';  // Switch to pause icon
            bio.style.display = 'none';  // Hide the bio when playing
            isPlaying = true;  // Set playing state to true
        }

        currentSong.addEventListener('timeupdate', () => {
            // Ensure the song's duration is valid
            if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
                const percent = (currentSong.currentTime / currentSong.duration) * 100;
                
                // Check if the progress-bar element exists
                const progressBar = document.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${percent}%`;
                }
            }
        });

        currentSong.addEventListener('ended', () => {
            PlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            const progressBar = document.querySelector('.progress-bar');
            progressBar.style.width = '0%';
            bio.style.display = 'block';
            Lyrics.style.display = 'none';
            currentSong = null;
            isPlaying = false;
        });

        showLyricsOne();
    });

    function showLyricsOne(){
       Lyrics.style.display = 'block';

       const allLyrics = document.querySelectorAll('.lyrics p');

       currentSong.addEventListener('timeupdate', () => {

            if(currentSongIndex === 0) {
                allLyrics.forEach(lyric => {
                    const startTime = parseFloat(lyric.getAttribute('data-start'));
                    const endTime = parseFloat(lyric.getAttribute('data-end'));

                    // Check if the current time is within the start and end time of the lyric line
                    if (currentSong.currentTime >= startTime && currentSong.currentTime <= endTime) {
                        lyric.classList.add('active'); // Show the line by adding 'active' class
                    } else {
                        lyric.classList.remove('active'); // Hide the line when out of range
                    }
                })
            }
       })
        
    }

   const songOverlay = document.querySelector('.song-overlay');
   const lyricsContainer = document.querySelector('.song-lyrics');
   const songContent = document.querySelector('.song-content');

    playIcons.forEach(playBtn => {
        playBtn.addEventListener('click', () => {
    
            // Check if a different audio is already playing
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause(); // Pause the currently playing audio
                currentAudio = null; // Reset currentAudio
                isAudioPlaying = false; // Update the playing state
               playIcons.forEach(p => { p.innerHTML = '<i class="fas fa-play"></i>'});
            } else {
                // Start playing the audio
                currentAudio = newSong; // Set currentAudio to the new song
                currentAudio.play();
                isAudioPlaying = true; // Update the playing state
                playIcons.forEach(p => { p.innerHTML = '<i class="fas fa-pause"></i>'});
    
                // Listen for when the audio finishes playing
                currentAudio.addEventListener('ended', () => {
                    playIcons.forEach(p => { p.innerHTML = '<i class="fas fa-play"></i>'});
                    songOverlay.style.display = 'none';
                    isAudioPlaying = false; // Update the state
                });

            }

            showLyrics()
        });
    });

    const  images = ['love.jpg','logo.jpg','love.jpg', 'img1.jpg', 'love.jpg', 'img2.jpg','love.jpg', 'img3.jpg']

    const lyrics = [
        {start: 8, eng: 'How does a moment last forever', end: 12},
        {start: 13, eng: 'How can a story never die', end: 15},
        {start: 16, eng: 'It is love we must hold onto',  end: 20},
        {start: 21, eng: 'Never easy, but we try', end: 25},
        {start: 26, eng: 'Sometimes our happiness is captured', end: 29},
        {start: 30, eng: 'Somehow, our time and place stand still', end: 33},
        {start: 34, eng: 'Love lives on inside our hearts and always will', end: 42},
    
        {start: 43, eng: 'Minutes turn to hours',  end: 47},
        {start: 48, eng: 'Days to years and gone',  end: 52},
        {start: 53, eng: 'But when all else has been forgotten', end: 56},
        {start: 57, eng: 'Still our song lives on', end: 63},
    
        {start: 64, eng: 'Maybe some moments weren\'t so perfect', end: 68},
        {start: 69, eng: 'Maybe some moments not so sweet', end: 72},
        {start: 73, eng: 'But we have to know some bad times or our lives are incomplete', end: 80},
        {start: 81, eng: 'Then when the shadows overtake us', end: 85},
        {start: 86, eng: 'Just when we feel all hope is gone',  end: 89},
        {start: 90, eng: 'We\'ll hear our song and know once more', end: 93},
        {start: 94, eng: 'Our love lives on', end: 99},
    
        {start: 105, eng: 'Ooooo, Ooooo, Oooo', end: 117},
    
        {start: 121, eng: 'How does a moment last forever', end: 124},
        {start: 125, eng: 'How does our happiness endure', end: 128},
        {start: 129, eng: 'Through the darkest of our troubles', end: 132},
        {start: 133, eng: 'Love is beauty, love is pure', end: 136},
        {start: 137, eng: 'Love pays no mind to desolation', end: 140},
        {start: 141, eng: 'It flows like a river to the soul',  end: 144},
        {start: 145, eng: 'Protects, perceives and perseveres',  end: 148},
        {start: 149, eng: 'And makes us whole', end: 153},
    
        {start: 154, eng: 'Minutes turn to hours', end: 157},
        {start: 158, eng: 'Days to years then gone', end: 164},
        {start: 165, eng: 'But when all else has been forgotten', end: 169},
        {start: 170, eng: 'Still our song lives on', end: 177},
    
        {start: 178, eng: 'How does a moment last forever', end: 182},
        {start: 183, eng: 'When our song lives on', end: 194},
        {start:195, eng: "Charles Memories", end: 222}
    ];
    
    function showLyrics() {
        songOverlay.style.display = 'flex';
        let currentLyricsIndex = 0;
        let currentImageIndex = 0;
    
        // Update the lyrics dynamically based on the current audio time
        currentAudio.addEventListener('timeupdate', () => {
            const currentTime = currentAudio.currentTime;
            
            // Check if we have lyrics to display
            if (currentLyricsIndex < lyrics.length) {
                const currentLyrics = lyrics[currentLyricsIndex];
                const currentImage = images[currentImageIndex];
    
                // Check if the current time is within the start and end of the current lyric
                if (currentTime >= currentLyrics.start && currentTime <= currentLyrics.end) {
                    lyricsContainer.innerHTML = `<h3>${currentLyrics.eng}</h3>`;
                    songContent.style.backgroundImage = `url(${currentImage})`;
                }
    
                // Move to the next lyric when the current one has ended
                if (currentTime > currentLyrics.end) {
                    currentLyricsIndex++;
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                }
            }
        });
    }

    document.querySelector('.close-overlay').onclick = () => {
        currentAudio.pause();
        playIcons.forEach(p => { p.innerHTML = '<i class="fas fa-play"></i>'});
        songOverlay.style.display = 'none';
        isAudioPlaying = false;
    }
});