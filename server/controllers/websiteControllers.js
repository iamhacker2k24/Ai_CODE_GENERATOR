const genarateResponse = require("../config/openRouter");
const userData = require("../model/usermodel");
const Website = require("../model/websiteModel");
const extractJSON = require("../utlis/extractJson");



const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }
        const user = req.user;
        console.log(user)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.credits < 50) {
            return res.status(400).json({
                success: false,
                message: "You do not have enough credits to generate a website"
            });
        }
        const finalPrompt = masterPrompt.replace(
            "USER_PROMPT",
            prompt.trim()
        );
        let raw = await genarateResponse(finalPrompt);
        console.log("AI RAW RESPONSE RECEIVED");
        console.log("RAW TYPE:", typeof raw);
        // console.log("RAW:", raw);
        let parsed = extractJSON(raw);
        if (!parsed || !parsed.code) {
            console.log("AI returned invalid JSON. Retrying...");
            raw = await genarateResponse(
                finalPrompt +
                "\n\nIMPORTANT: RETURN ONLY VALID JSON. " +
                "The JSON must contain exactly these fields: " +
                "\"message\" and \"code\". " +
                "The code field must contain the complete HTML website."
            );
            parsed = extractJSON(raw);
        }
        if (!parsed || !parsed.code) {
            console.log("AI returned invalid response");
            return res.status(400).json({
                success: false,
                message: "AI returned an invalid website response"
            });
        }

        console.log("Website model:", Website);
        console.log("Website.create:", Website.create);


        const web = await Website.create({
            user: user._id,
            title: prompt.trim().slice(0, 60),
            latestCode: parsed.code,
            conversation: [
                {
                    role: "user",
                    content: prompt.trim()
                },
                {
                    role: "ai",
                    content: parsed.message || "Website generated successfully"
                }
            ],
            deployed: false
        });

        user.credits -= 50;
        await user.save();
        return res.status(201).json({
            success: true,
            message: "Website generated successfully",
            websiteId: web._id,
            title: web.title,
            remainingCredits: userData.credits
        });

        // return res.status(200).json(parsed) //testing 
    } catch (error) {
        console.error(
            "Generate website error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating the website",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};


const getWebsiteByid = async (req, res) => {

    const id = req.params.id
    try {
        const website = await Website.findOne({
            _id: id,
            // user: req.user._id
        })
        console.log(website)
        if (!website) {
            return res.status(400).json({ msg: "website not found " })
        }
        return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}


const changes = async (req, res) => {
    try {
        console.log("working from update")
        const { prompt } = req.body;
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }
        const id = req.params.id;
        const website = await Website.findOne({
            _id: id,
            // user: req.user._id
        })
        if (!website) {
            return res.status(400).json({ msg: "website not found " })
        }
        console.log(website.user)
        const user = userData.findById({ _id: website.user })
        // const user = req.user;
        // console.log(user)

        // if (!user) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "User not found"
        //     });
        // }
        const updateprompt = `
        CURRENT CODE:
        ${website.latestCode}
        USER REQUEST:
        ${prompt}

        RETRUN RAW JSON ONLY:{
        
        "message":"Short confirmation",
        "code":"<UPDATED FULL HTML>"
        
        }
        `

        console.log(updateprompt)
        let raw = await genarateResponse(updateprompt);
        console.log("AI RAW RESPONSE RECEIVED");
        console.log("RAW TYPE:", typeof raw);
        // console.log("RAW:", raw);
        let parsed = extractJSON(raw);
        if (!parsed || !parsed.code) {
            console.log("AI returned invalid JSON. Retrying...");
            raw = await genarateResponse(
                finalPrompt +
                "\n\nIMPORTANT: RETURN ONLY VALID JSON. " +
                "The JSON must contain exactly these fields: " +
                "\"message\" and \"code\". " +
                "The code field must contain the complete HTML website."
            );
            parsed = extractJSON(raw);
        }
        if (!parsed || !parsed.code) {
            console.log("AI returned invalid response");
            return res.status(400).json({
                success: false,
                message: "AI returned an invalid website response"
            });
        }

        website.conversation.push({
            role: "ai",
            content: parsed.code
        }, {
            role: "user",
            content: prompt
        })

        website.latestCode = parsed.code;
        await website.save();
        if (user.credits < 25) {
            return res.status(400).json({ messsage: "you have not enough credits to generatae website " })
        }
        return res.status(200).json({
            message: parsed.message,
            code: parsed.code,
            remainingCredits: user.credits
        })
    }
    catch (error) {
        return res.status(500).json({
            message: `update website error ${error.message} `
        })
    }
}


const getAll = async (req, res) => {
    try {
        const website = await Website.find({
            user: req.user._id
        })
        return res.status(200).json(website)

    }
    catch (err) {
        return res.status(500).json({
            message: `getAll website error `
        })
    }
}





module.exports = { generateWebsite, getWebsiteByid, changes, getAll }


