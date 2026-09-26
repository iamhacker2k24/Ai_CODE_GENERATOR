const extractJSON = (response) => {
    if (!response) {
        return null;
    }

    // Already an object
    if (typeof response === "object") {
        return response;
    }

    // String response
    try {
        const cleaned = response
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
            return null;
        }

        const jsonString = cleaned.slice(
            firstBrace,
            lastBrace + 1
        );

        return JSON.parse(jsonString);

    } catch (error) {
        console.error(
            "JSON parsing failed:",
            error.message
        );

        return null;
    }
};

module.exports = extractJSON;