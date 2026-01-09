import transporter from "../config/nodemailer.js";
import massModel from "../models/massForm.js";

export const createMassBooking = async (req, res) => {
  try {
    const { userId, isVerified } = req.user;

    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: "user not verified",
      });
    }

    const {
      massType,
      offerForName,
      offerByName,
      email,
      preferedDate,
      preferedTime,
      yearOfMarriage,
      dob,
      age,
      relationToDeceased,
      yearSinceDeath,
      dateOfDeath,
    } = req.body;

    if (
      !massType ||
      !offerByName ||
      !offerForName ||
      !preferedDate ||
      !preferedTime
    ) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (massType === "WEDDINGANNIVERSARY" && !yearOfMarriage) {
      return res.json({
        success: false,
        message: "Year of marriage is required",
      });
    }

    if (massType === "BIRTHDAY" && !age) {
      return res.json({ success: false, message: "Age is required" });
    }

    if (massType === "MONTHMIND" && !relationToDeceased) {
      return res.json({
        success: false,
        message: "Relation to deceased is required",
      });
    }

    if (massType === "DEATHANNIVERSARY" && (!yearSinceDeath || !dateOfDeath)) {
      return res.json({
        success: false,
        message: "Death details are required",
      });
    }

    const booking = await massModel.create({
      user: userId,
      massType,
      offerForName,
      offerByName,
      email,
      preferedDate,
      preferedTime,
      yearOfMarriage,
      dob,
      age,
      relationToDeceased,
      yearSinceDeath,
      dateOfDeath,
    });

    return res.status(201).json({
      success: true,
      message: "Mass booking submitted successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const massStatus = async (req, res) => {
  try {
    const { userId, isVerified } = req.user;

    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email to view mass status",
      });
    }

    const masses = await massModel
      .find({ user: userId })
      .select("offerForName massType status adminRemark preferedDate -_id")
      .sort({ preferedDate: 1 });

    if (masses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No mass bookings found",
      });
    }

    return res.status(200).json({
      success: true,
      data: masses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mass status",
      error: error.message,
    });
  }
};

export const adminMassStatus = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    const masses = await massModel
      .find()
      .populate("user", "name email")
      .select("offerForName massType status preferedDate user")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: masses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all mass bookings",
      error: error.message,
    });
  }
};

export const updateMassStatus = async (req, res) => {
  try {
    const { role } = req.user;
    const { massId, status, remark } = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    if (!massId || !status) {
      return res.json({
        success: false,
        message: "Mass ID and status are required",
      });
    }
    if (!["approved", "rejected"].includes(status)) {
      return res.json({
        success: false,
        message: "Invalid status value",
      });
    }

    if (status === "rejected" && !remark) {
      return res.json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const mass = await massModel
      .findById(massId)
      .populate("user", "email name");

    if (!mass) {
      return res.json({
        success: false,
        message: "Mass booking not found",
      });
    }

    if (mass.status !== "pending") {
      return res.json({
        success: false,
        message: "Only pending bookings can be updated",
      });
    }

    mass.status = status;
    mass.adminRemark = remark || "";
    await mass.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: mass.user.email,
      subject: "Update on Your mass Request 🙏",
      html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>

  <body style="margin:0; padding:0; background-color:#eef2f7;
               font-family: Georgia, 'Times New Roman', serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:10px; overflow:hidden;
                   box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:#1e3a8a; color:#ffffff;
                         padding:26px; text-align:center;">
                <div style="font-size:26px; margin-bottom:8px;">✝</div>
                <h1 style="margin:0; font-size:22px; font-weight:normal;">
                  Our Lady of the Poor Church
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:35px 40px; color:#333;">
                <p style="font-size:16px; margin-top:0;">
                  Dear <strong>${mass.user.name}</strong>,
                </p>

                ${
                  status === "approved"
                    ? `
                    <p style="font-size:15px; line-height:1.7;">
                      We are pleased to inform you that your
                      <strong>mass request has been approved</strong>.
                    </p>

                    <div style="margin:25px 0; padding:15px;
                                background:#f0fdf4;
                                border-left:4px solid #16a34a;
                                border-radius:5px;">
                      ✅ <strong>Status:</strong> Approved
                    </div>

                    <p style="font-size:15px; line-height:1.7;">
                      Kindly log in to your account and complete the payment
                      to proceed further with the mass process.
                    </p>

                    
                    `
                    : `
                    <p style="font-size:15px; line-height:1.7;">
                      After careful review, we regret to inform you that your
                      <strong>mass request has been rejected</strong>.
                    </p>

                    <div style="margin:25px 0; padding:15px;
                                background:#fef2f2;
                                border-left:4px solid #dc2626;
                                border-radius:5px;">
                      ❌ <strong>Status:</strong> Rejected
                    </div>

                    <p style="font-size:15px; line-height:1.7;">
                      <strong>Reason:</strong><br/>
                      ${remark || "No additional remarks provided."}
                    </p>

                    <p style="font-size:15px; line-height:1.7;">
                      For further clarification, kindly contact the parish office.
                    </p>
                    `
                }

                <p style="font-size:14px; margin-top:25px;">
                  With prayers and blessings,<br/>
                  <strong>Our Lady of the Poor Church</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f5f9; padding:16px;
                         text-align:center; font-size:12px; color:#666;">
                © ${new Date().getFullYear()} Our Lady of the Poor Church
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: `Mass booking ${status} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update mass status",
      error: error.message,
    });
  }
};
