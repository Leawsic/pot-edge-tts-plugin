async function tts(text, _lang, options = {}) {

    const {
        config,
        utils
    } = options;


    const {
        http
    } = utils;


    const {
        fetch,
        Body
    } = http;


    let {
        requestPath,
        apiKey,
        voice,
        speed
    } = config;



    if (!requestPath) {

        requestPath =
            "https://tts.leawsic.ltd";

    }


    if (!/https?:\/\/.+/.test(requestPath)) {

        requestPath =
            `https://${requestPath}`;

    }


    if (requestPath.endsWith("/")) {

        requestPath =
            requestPath.slice(0, -1);

    }


    if (!requestPath.endsWith("/v1/audio/speech")) {

        requestPath +=
            "/v1/audio/speech";

    }



    if (!apiKey) {

        throw "apiKey is required";

    }



    if (!voice) {

        voice =
            "zh-CN-XiaoxiaoNeural";

    }



    if (!speed) {

        speed =
            1.0;

    }



    const res =
        await fetch(

            requestPath,

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    "Authorization":
                    `Bearer ${apiKey}`

                },


                body:

                Body.json({

                    model:
                    "tts-1",


                    input:
                    text,


                    voice:
                    voice,


                    speed:
                    parseFloat(speed),


                    response_format:
                    "mp3"

                }),


                responseType:
                3

            }

        );



    if (res.ok) {

        if (res.data) {

            return res.data;

        }


        throw JSON.stringify(
            res.data
        );

    }


    throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;

}
