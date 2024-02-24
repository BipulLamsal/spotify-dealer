import imageUrlToBase64 from "./getBase64Encode";
export default async function generateSvg(spotifyData: any) {
  console.log(spotifyData);
  const songImgBase64 = await imageUrlToBase64(spotifyData.song_image);
  const spotifyImgBase64 = await imageUrlToBase64(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png"
  );

  try {
    const svgCode = `<svg width="400px" height="200px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-labelledby="cardTitle" role="img">
  <title id="cardTitle">Now playing on Spotify</title>
  <style>
    :root {
      --timing: 0.6s;
      --ease: ease-in;
    }
  
    .recent-track {
      font-family: "Poppins", sans-serif;
      max-width: 400px;
      color: white;
      padding: 10px 20px;
    }
  
    .spotify-heading {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom:-10px;
    }
  
    .spotify-heading img {
      height: 25px;
    }
  
    .spotify-heading p {
      margin-left: 10px;
      font-weight: 700;
    }
  
    .track-container {
      margin-top: 10px;
      border-radius: 10px;
      display: flex;
      border: 2px solid #0d1117;
      padding: 10px;
      align-items: center;
      background-color: #0d1117;
    }
  
    .track-image img {
      border-radius: 10px;
      width: 50px;
      height: 50px;
      object-fit: cover;
    }
  
    .track-text {
      margin-left: 20px;
    }
  
    .track-text-song {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom:-25px;
      color:#eee;
    }
  
    .track-text-song p {
      font-weight: 700;
    }
  
    .recent-track__icon {
      width: 18px;
      height: 14px;
      position: relative;
      display: flex;
    }
  
    .recent-track__icon span {
      height: 100%;
      width: 5px;
      background: #0EE263;
      transform-origin: bottom;
      margin: 1px;
    }
  
    .recent-track__icon span:nth-child(1) {
      animation: sound1 var(--timing) infinite var(--ease);
    }
  
    .recent-track__icon span:nth-child(2) {
      animation: sound2 var(--timing) infinite var(--ease);
    }
  
    .recent-track__icon span:nth-child(3) {
      animation: sound3 var(--timing) infinite var(--ease);
    }
  
    .recent-track__icon span:nth-child(4) {
      animation: sound4 var(--timing) infinite var(--ease);
    }
  
    @keyframes sound1 {
      20% {
        transform: scaleY(0.5);
      }
    }
  
    @keyframes sound2 {
      40% {
        transform: scaleY(0.5);
      }
    }
  
    @keyframes sound3 {
      60% {
        transform: scaleY(0.5);
      }
    }
  
    @keyframes sound4 {
      80% {
        transform: scaleY(0.5);
      }
    }
  </style>
  
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="recent-track">
      <div class="spotify-heading">
        <img
          src="${spotifyImgBase64}"
        />
        <p class="title">Now playing</p>
      </div>
      <div class="track-container">
        <div class="track-image">
          <img
            src="${songImgBase64}"
          />
        </div>
        <div class="track-text">
          <div class="track-text-song">
            <div class="recent-track__icon">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>${spotifyData.song_name}</p>
          </div>
          <div class="track-artist">
            <p>${spotifyData.artist_name}</p>
          </div>
        </div>
      </div>
    </div>
  </foreignObject>
  </svg>
  
  `;
    // console.log(svgCode);
    return svgCode;
  } catch (err) {
    console.log(err);
  }
  // return {"DATA" : "SDFS"}
}
