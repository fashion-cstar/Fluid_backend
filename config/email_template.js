var email = require('./teamlink').email;
var social_links = require('./teamlink').social_links;

const header = () => {
    return `
    <div style='width:100%;'>
        <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="100%" bgcolor="#F3F2EF" style="background-color:#F3F2EF;table-layout:fixed">
            <tbody>
                <tr>
                    <td align="center" style="padding:24px"> 
                        <center style="width:100%">
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="512" bgcolor="transparent" style="background-color:transparent;margin:0 auto;max-width:512px;width:inherit">
                                <tbody>
                                    <tr>
                                        <td bgcolor="#FFFFFF" style="background-color:#ffffff;padding:48px 32px;">
                                            <table role='presentation' align='center' style='border-spacing:0!important;border-collapse:collapse;width:auto;text-align:center' width='auto'>
                                                <tbody>
                                                    <tr align='center'>
                                                        <td>                    
                                                            <img src='${process.env.APP_URL}/images/email_assets/fluid_logo.png' width='120' style="outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>                                                            
    `
};

const footer = () => {
    return `        
                                        <table role='presentation' align='center' style='padding:72px 0px 36px 0px;border-spacing:0!important;border-collapse:collapse;width:auto;text-align:center' width='auto'>
                                            <tbody>
                                                <tr align='center'>
                                                    <td> 
                                                        <img src='${process.env.APP_URL}/images/email_assets/horizontal.png' style="outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p style='text-align:center;color:grey;'>
                                            Thank you for choosing &#160;<span style='color:black'>FLUID</span>
                                        </p>
                                        <p style='text-align:center;color:grey;'>
                                            If you have any question, suggestions, or concerns, reach out to our support team<br />
                                            <span style='text-align:center;color:blue;font-size:14px'>${email.fluid_support}</span>
                                        </p>          
                                        <table role='presentation' align='center' style='border-spacing:0!important;border-collapse:collapse;width:auto;text-align:center' width='auto'>
                                            <tbody>
                                                <tr align='center'>
                                                    <td style='padding:0px 16px;'>
                                                        <a href='${social_links.linkedin}' target='_blank'>
                                                            <img src='${process.env.APP_URL}/images/email_assets/linkedin.png' width='20' style="outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" />
                                                        </a>                        
                                                    </td>
                                                    <td style='padding:0px 16px;'>
                                                        <a href='${social_links.twitter}' target='_blank'>
                                                            <img src='${process.env.APP_URL}/images/email_assets/twitter.png' width='20' style="outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" />
                                                        </a> 
                                                    </td>
                                                    <td style='padding:0px 16px;'>
                                                        <a href='${social_links.youtube}' target='_blank'>
                                                            <img src='${process.env.APP_URL}/images/email_assets/youtube.png' width='20' style="outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" />
                                                        </a> 
                                                    </td>
                                                    <td style='padding:0px 16px;'>
                                                        <a href='${social_links.telegram}' target='_blank'>
                                                            <img src='${process.env.APP_URL}/images/email_assets/telegram.png' width='20' style="outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" />
                                                        </a> 
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </center>
                </td>
            </tr>
        </tbody>
    </table>
</div>
    `
};

const body = (subject, username, contenthtml) => {
    return `
    <h2 style='text-align:center;'>${subject}</h2>
    <p style="font-size:14px;line-height:24px">
        Dear ${username},<br />
        ${contenthtml}
    </p>
    <p style="font-size:14px;line-height:24px">The FLUID Team</p>    
    `
};

exports.getVerifiedContent = (username) => {
    let subject = 'Your email has been verified!'
    let note = `Thank you for verifying the email address for your FLUID account.<br />
Please wait for approval to login.<br />
If this was not you, immediately email support on <span style='color:blue;'>${email.fluid_support}</span>.<br />`

    return header() + body(subject, username, note) + footer()
};

exports.getApprovalAccountContent = (username) => {
    let subject = 'Your FLUID account has been approved!'
    let note = `Congratulations! Your FLUID account has been approved.<br />
From now on, you can log in to the Fluid Portal with your account.<br />`

    return header() + body(subject, username, note) + footer()
};

exports.getReqVerifyContent = (username, link) => {
    let subject = 'Welcome to FLUID; please verify your email'
    let note = `We thank you for using the FLUID, the ultra-low latency CeDeFi liquidity aggregator that uses AI quant-based models to tackle fragmented liquidity in virtual asset markets.<br />
Please verify your email by clicking the following link: <br /><br />${link}<br /><br />
If clicking the link doesn’t work, you can copy and paste the link into your web browser’s address bar. You will be able to create a new password for your FLUID account after clicking the link above.<br />
FLUID will never e-mail you and ask you to disclose or verify your password, wallet address, secret phrase, or other confidential information. If you receive a suspicious e-mail with a link to update your account information, do not click on the link. Instead, report the e-mail to FLUID for investigation at ${email.fluid_cybersecurity}<br />
Thank you for using FLUID<br />`

    return header() + body(subject, username, note) + footer()
};

exports.getResetContent = (username, link) => {
    let subject = 'Reset email'
    let note = `Greetings from FLUID.<br />
We received a request to reset the password for the FLUID account associated with this e-mail address. Click the link below to reset your password using our secure server:<br /><br />
${link}<br /><br />
If clicking the link doesn’t work, you can copy and paste the link into your web browser’s address bar. You will be able to create a new password for your FLUID account after clicking the link above.<br />
FLUID will never e-mail you and ask you to disclose or verify your password, wallet address, secret phrase, or other confidential information. If you receive a suspicious e-mail with a link to update your account information, do not click on the link. Instead, report the e-mail to FLUID for investigation at ${email.fluid_cybersecurity}<br />
Thank you for using FLUID<br />`

    return header() + body(subject, username, note) + footer()
};

exports.getEventAlertContent = (username, action, ip, device, location, time) => {
    let subject = 'Detected a ' + action
    let note = `This is to notify you of ${action} on your FLUID account at ${time}.<br /><br />
IP: ${ip}<br />
Device: ${device}<br />
Location: ${location}<br />
Time: ${time}<br /><br />
If this was not you, please notify the administrator immediately.<br />
Thanks for using FLUID<br />`

    return header() + body(subject, username, note) + footer()
};