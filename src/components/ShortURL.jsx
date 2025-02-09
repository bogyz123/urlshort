import { useEffect } from "react";
import { useParams } from "react-router";

export default function ShortURL() {
  const { url } = useParams();
  useEffect(() => {
    function RedirectToOriginalURL(shortenedUrl) {
      var endpoint = "https://linkifyurl.netlify.app/api/getUrl/" + shortenedUrl;
      fetch(endpoint, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }).then((res) => {
        if (res.status === 404) {
          return null;
        }
        res.json().then((json) => {
          const originalURL = json.original;
          var urlToOpen;
          if (!originalURL.startsWith("https://") || !originalURL.startsWith("http://")) {
            urlToOpen = "https://" + originalURL;
          } else {
            urlToOpen = originalURL;
          }
          window.location.href = urlToOpen;
        });
      });
    }
    RedirectToOriginalURL(url);
  }, []);

  const styles = {
    container: {
      position: "absolute",
      left: "0",
      top: "0",
      background: "rgba(0,0,0,.7)",
      width: "100%",
      height: "100%",
      color: "white",
      fontSize: "20px",
      textAlign:'center',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      userSelect: "none",
      
    },
  };
  return (
    <div style={styles.container}>
      <span>Loading {url}...</span>
    </div>
  );
}
