import { useState } from "react";
import styles from "../assets/URLShortener.module.css";
import { Link, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import goBack from "../assets/go-back.svg";

export default function URLShortener() {
  const [urlToShorten, setUrlToShorten] = useState("");
  const [oldUrl, setOldUrl] = useState(null);
  const [newUrl, setNewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [animation, setAnimation] = useState(false);

  const copyLink = async (link) => {
    if (link) {
      const text = "https://linkifyshortener.netlify.app/#/" + link;
      await navigator.clipboard.writeText(text);
      setCopied(true);
    }
  };
  const nav = useNavigate();
  const reset = () => {
    nav("/");
    setCopied(false);
    setError(null);
    setNewUrl(null);
    setOldUrl(null);
    setUrlToShorten("");
    setAnimation(false);
  };
  return (
    <div id={styles.urlShortener}>
      <div id={styles.shortenerInner} className={`${animation && styles.animationNarrow}`}>
        {animation ? (
          <>
            <div id={styles.shortenedData}>
              {oldUrl && newUrl && (
                <>
                  <div className="flex | centerX | space-around" id={styles.urlContainer}>
                    <img src={goBack} alt="go back button" id={styles.goBack} onClick={() => reset()} />
                    <div className={styles.urls}>
                      <span>Old URL</span>
                      <span>{oldUrl}</span>
                    </div>
                    <div id={styles.qrcode}>
                      <QRCode value={newUrl} style={{ width: "100px", height: "100px" }} />
                    </div>
                    <div className={styles.urls}>
                      <span>New URL</span>
                      <span>{newUrl}</span>
                    </div>
                  </div>
                  <Link className={`${styles.btn} ${styles.link} ${styles.animated}`} to={newUrl}>
                    Open
                  </Link>
                  <button className={`${styles.btn} ${styles.animated}`} style={{ color: "white" }} onClick={async () => await copyLink(newUrl)}>
                    Copy Link
                  </button>
                  {copied && (
                    <div className="text-center" style={{ color: "lime", userSelect: "none" }}>
                      <span>Successfully copied the link!</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-center">Linkify | URL Shortener</p>
            <div className="flex | flexCol | gapX">
              <input type="text" placeholder="URL to shorten" onChange={(e) => setUrlToShorten(e.target.value)} />
              <button onClick={() => ShortenURL(urlToShorten, setOldUrl, setNewUrl, setError, setAnimation)} className={`${styles.btn} ${styles.animated}`} id={styles.linkify}>
                Linkify!
              </button>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
}

function ShortenURL(url, setOldUrl, setNewUrl, setError, setAnimation) {
  if (url && url.length > 3) {
    var endpoint = "https://4c34-178-221-71-48.ngrok-free.app/shortener/v1/shorten";
    fetch(endpoint, {
      headers: {
        "ngrok-skip-browser-warning": "69420",
        "Access-Control-Allow-Origin": "*",
        url: url,
      },
      method: "POST",
    }).then((res) => {
      if (res.status != 200) {
        return null;
      }
      res.json().then((json) => {
        if (json.oldUrl && json.newUrl) {
          setAnimation(true);
          setTimeout(() => {
            setOldUrl(json.oldUrl);
            setNewUrl(json.newUrl);
          }, 600);
        }
      });
    });
  } else {
    setError({ message: "You have entered an incorrect URL." });
  }
}
