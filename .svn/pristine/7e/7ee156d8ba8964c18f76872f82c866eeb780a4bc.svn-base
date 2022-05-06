import React from 'react';
//hoa fix

// OneSignal
import OneSignal from 'react-onesignal'

class Main extends React.Component {

    componentDidMount() {
        OneSignal.init({
            appId: "4f7585e1-2982-40a8-8bcf-6e549a72a7ec"
        })
        
        // this.addScript("assets/js/core.min.js", "core");
        this.addScript("assets/js/app.js", "app");
        this.addScript("assets/js/script.js", "script");
        this.addScript("assets/js/index.js", "index");
    }

    addScript(src, myClass) {

        // console.log("debug");
        const newScript = document.createElement("script");
        newScript.setAttribute("class", myClass);
        newScript.setAttribute("src", src + '?n=' + Math.random().toString());
        newScript.setAttribute("type", "text/javascript");
        newScript.async = false;

        const getScript = document.querySelector("." + myClass);
        if (getScript !== null) {
            // getScript.parentNode.replaceChild(newScript, getScript);
            return;
        }
        document.getElementsByTagName("body")[0].appendChild(newScript);
    }

    render() {
        return (
           this.props.children
        );
    }
}

export default Main;