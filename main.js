async function tts(text, lang, options = {}) {

    const {
        config,
        utils
    } = options;


    const {
        tauriFetch
    } = utils;



    const server =
        config.server ||
        "https://tts.leawsic.ltd";



    const apiKey =
        config.apiKey ||
        "";



    const voice =
        config.voice ||
        getDefaultVoice(lang);



    const speed =
        config.speed ||
        1.0;



    const response =
        await tauriFetch(

            `${server}/v1/audio/speech`,

            {
                method: "POST",

                headers: {

                    "Authorization":
                    `Bearer ${apiKey}`,

                    "Content-Type":
                    "application/json"

                },


                body: JSON.stringify({

                    model:
                    "tts-1",

                    input:
                    text,

                    voice:
                    voice,

                    response_format:
                    "mp3",

                    speed:
                    speed

                })

            }

        );



    if (!response.ok) {

        throw new Error(
            JSON.stringify(
                response.data
            )
        );

    }



    /*
        OpenAI TTS 返回的是音频二进制

        Pot 模板需要 audio 字符串

        tauriFetch 返回结构不同版本可能不同

    */


    if (
        response.data.audio
    ) {

        return response.data.audio;

    }



    if (
        response.data
        instanceof Uint8Array
    ) {

        return arrayBufferToBase64(
            response.data
        );

    }



    if (
        typeof response.data === "string"
    ){

        return response.data;

    }



    throw new Error(
        "Unsupported audio response"
    );

}





function getDefaultVoice(lang){


    if (
        lang.startsWith("zh")
    ){

        return "zh-CN-XiaoxiaoNeural";

    }


    if (
        lang.startsWith("ja")
    ){

        return "ja-JP-NanamiNeural";

    }


    if (
        lang.startsWith("ko")
    ){

        return "ko-KR-SunHiNeural";

    }


    if (
        lang.startsWith("en")
    ){

        return "en-US-AriaNeural";

    }


    return "zh-CN-XiaoxiaoNeural";

}





function arrayBufferToBase64(buffer){


    let binary = "";

    const bytes =
        new Uint8Array(buffer);


    for(
        let i=0;
        i<bytes.length;
        i++
    ){

        binary +=
        String.fromCharCode(
            bytes[i]
        );

    }


    return btoa(binary);

}





export {
    tts
};
