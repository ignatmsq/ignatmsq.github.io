document.addEventListener("DOMContentLoaded", () => {
  const webViewContainer = document.getElementById("webViewContainer");
  const webView = document.getElementById("webView");
  const toggleButton = document.getElementById("toggleWebView");
  const integrationOptions = document.getElementById("integrationOptions");

  const postData = {
    userId: "YOUR USER ID",
    key: "YOUR API KEY",
    company: "YOUR COMPANY",

    // Optional user data fields
    lifestyle: "Sedentary", // Active, or Very Active
    age: 50,
    height: 150,
    weight: 200,
    gender: "Male",
  };

  integrationOptions.addEventListener("change", () => {
    const selectedOption = integrationOptions.value;
    toggleButton.textContent = `Start ${selectedOption}`;
  });

  toggleButton.addEventListener("click", () => {
    const selectedOption = integrationOptions.value;
    let url;
    switch (selectedOption) {
      case "Complete User Experience":
        url = "https://kinestex.vercel.app";
        postData.planC = "Cardio"; // specify the category of the plans to be presented
        break;
      case "Workout Plan":
        url = "https://kinestex.vercel.app/plan/Full%20Cardio"; // in the URL, replace with the plan you want to present
        break;
      case "AI Experience":
        url = "https://kinestex.vercel.app/experiences/training"; // in the URL, replace with the experience you want to present
        postData.exercise = "Manual Handling"; // specify the exercise to be presented
        break;
      case "Workout":
        url = "https://kinestex.vercel.app/workout/Fitness%20Lite"; // in the URL replace with the workout you want to display
        break;
      case "Challenge":
        url = "https://kinestex.vercel.app/challenge";
        postData.exercise = "Squats"; // specify the exercise to be presented
        postData.countdown = 50; // specify the timer time for the challenge
        break;
    }

    const isVisible = webViewContainer.style.display !== "none";
    webViewContainer.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
      webView.onload = () => {
        webView.contentWindow.postMessage(postData, url);
      };
      webView.src = url; // Set the new URL for the iframe
    }
  });

  window.addEventListener("message", (event) => {
    // ensure data is received from KinesteX
    if (event.origin !== "https://kinestex.vercel.app") {
      return;
    }

    try {
      const message = JSON.parse(event.data);
      console.log("Received data:", message);

      switch (message.type) {
        case "finished_workout":
        case "error_occured":
        case "exercise_completed":
          console.log("Received data:", message.data);
          break;
        case "exit_kinestex": // clicking on exit button, hide KinesteX
          webViewContainer.style.display = "none";
          break;
      }
    } catch (e) {
      console.error("Could not parse JSON message from WebView:", e);
    }
  });
});
