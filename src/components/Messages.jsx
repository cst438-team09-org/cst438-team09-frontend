
// format messages from the REST request
// this can be from a JavaScript exception, or a message(s)
// returned from the REST server.  The message may be from 
// validation errors at the server, or some other error.

function Messages({ response }) {

    if (response === '') {
        // nothing to display
        return

    } else if (typeof response === 'string') {
        // if the response is a single string
        return (
            <ul style={{ listStyleType: 'none' }}>
                <li>{response}</li>
            </ul>
        )

    } else if ("errors" in response) {
        // display validation messages from errors list
        return (
            <ul style={{ listStyleType: 'none' }}>
                {response.errors.map((error, idx) =>
                    < li key={idx}>{error}</li>
                )}
            </ul >
        )

    } else if ("message" in response) {
        // if response has a "message" field
        return (
            <ul style={{ listStyleType: 'none' }}>
                <li>{response.message}</li>
            </ul>
        )

    } else if ("status" in response) {
        return (
            <ul style={{ listStyleType: 'none' }}>
                <li>Error {response.status}</li>
            </ul>
        )

    } else {
        return (
            <ul style="list-style-type:none;">
                <li>Error {response}</li>
            </ul>
        )
    }
}

export default Messages;