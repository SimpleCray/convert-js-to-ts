


export function removeURLParameter(paramKey: string): void {
    // Get the current URL
    const url = window.location.href;

    // Create a regular expression to search for the parameter
    const regex = new RegExp('([?&])' + paramKey + '=[^&]+(&|$)', 'i');

    // Replace the parameter in the URL with an empty string
    let newURL = url.replace(regex, '$1');

    // Remove any trailing '&' or '?' from the resulting URL
    newURL = newURL.replace(/[&?]$/, '');

    // Use the History API to replace the current URL without reloading the page
    window.history.replaceState({}, document.title, newURL);
}

export function getUrlParameter(paramKey: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramKey);
}