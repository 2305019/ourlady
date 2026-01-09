import transporter from "../config/nodemailer.js";
import certificateModel from "../models/CertificateReq.js";

export const createCertificateRequest = async (req, res) => {
  try {
    const { userId, isVerified } = req.user;

    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: "User not verified!",
      });
    }

    const {
      certificateType,

      requestPurpose,
      requesterName,
      requesterRelation,

      dateOfBaptism,
      fatherName,
      motherName,

      groomsName,

      bridesName,

      dateOfMarriage,
      marriageRegNo,
    } = req.body;

    if (
      !certificateType ||
      !requestPurpose ||
      !requesterName ||
      !requesterRelation
    ) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (certificateType === "BAPTISM") {
      if (!dateOfBaptism || !fatherName || !motherName) {
        return res.json({
          success: false,
          message: "Complete baptism details are required",
        });
      }
    }

    if (certificateType === "MARRIAGE") {
      if (!groomsName || !bridesName || !dateOfMarriage) {
        return res.json({
          success: false,
          message: "Complete marriage details are required",
        });
      }
    }

    const certBook = await certificateModel.create({
      user: userId,
      certificateType,

      requestPurpose,
      requesterName,
      requesterRelation,

      dateOfBaptism,
      fatherName,
      motherName,
      groomsName,

      bridesName,

      dateOfMarriage,
      marriageRegNo,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate request sent successfully",
      certBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const certStatus = async (req, res) => {
  try {
    const { userId, isVerified } = req.user;
    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: "User not verified",
      });
    }
    const cert = await certificateModel
      .find({ user: userId })
      .select(
        "certificateType requestPurpose certificatePdf status paymentStatus remark"
      )
      .sort({ createdAt: -1 });

    if (cert.length === 0) {
      return res.status(404).json({
        success: false,
        message: "no request found",
      });
    }
    return res.status(200).json({ success: true, data: cert });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const adminCertStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    const certificates = await certificateModel
      .find()
      .populate("user", "name email")
      .select(
        "requesterName requestPurpose certificateType status remark paymentStatus certificatePdf createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificate requests",
      error: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    const { certificateId, status, remark } = req.body;

    if (!certificateId || !status) {
      return res.json({
        success: false,
        message: "Certificate ID and status are required",
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
        message: "Remark is required for rejection",
      });
    }

    const certificate = await certificateModel
      .findById(certificateId)
      .populate("user", "email name");

    if (!certificate) {
      return res.json({
        success: false,
        message: "Certificate request not found",
      });
    }

    if (certificate.status !== "pending") {
      return res.json({
        success: false,
        message: "Only pending requests can be updated",
      });
    }

    certificate.status = status;
    certificate.remark = remark || "";

    if (status === "approved") {
      certificate.paymentStatus = "pending";
    }

    await certificate.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: certificate.user.email,
      subject: "Update on Your Certificate Request 🙏",
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
                  Dear <strong>${certificate.user.name}</strong>,
                </p>

                ${
                  status === "approved"
                    ? `
                    <p style="font-size:15px; line-height:1.7;">
                      We are pleased to inform you that your
                      <strong>certificate request has been approved</strong>.
                    </p>

                    <div style="margin:25px 0; padding:15px;
                                background:#f0fdf4;
                                border-left:4px solid #16a34a;
                                border-radius:5px;">
                      ✅ <strong>Status:</strong> Approved
                    </div>

                    <p style="font-size:15px; line-height:1.7;">
                      Kindly log in to your account and complete the payment
                      to proceed further with the certificate process.
                    </p>

                    
                    `
                    : `
                    <p style="font-size:15px; line-height:1.7;">
                      After careful review, we regret to inform you that your
                      <strong>certificate request has been rejected</strong>.
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

    return res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markPaymentPaid = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false });
    }

    const { certificateId } = req.body;

    await certificateModel.findByIdAndUpdate(certificateId, {
      paymentStatus: "paid",
    });

    res.json({ success: true, message: "Payment marked as paid" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const uploadCertificatePdf = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    const { certificateId } = req.body;

    if (!certificateId || !req.file) {
      return res.json({
        success: false,
        message: "Certificate ID and PDF required",
      });
    }

    const certificate = await certificateModel.findById(certificateId);

    if (!certificate) {
      return res.json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (certificate.status !== "approved") {
      return res.json({
        success: false,
        message: "Certificate not approved yet",
      });
    }

    // 🔴 THIS WAS MISSING
    if (certificate.paymentStatus !== "paid") {
      return res.json({
        success: false,
        message: "Payment not completed",
      });
    }

    certificate.certificatePdf = req.file.path;
    certificate.deliveredAt = new Date();

    await certificate.save();

    return res.json({
      success: true,
      message: "Certificate PDF uploaded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markCertificatePaid = async (req, res) => {
  try {
    const { userId } = req.user;
    const { certificateId } = req.body;

    const certificate = await certificateModel.findOne({
      _id: certificateId,
      user: userId,
    });

    if (!certificate) {
      return res.json({ success: false, message: "Certificate not found" });
    }

    if (certificate.status !== "approved") {
      return res.json({ success: false, message: "Payment not allowed yet" });
    }

    if (certificate.paymentStatus === "paid") {
      return res.json({ success: false, message: "Already paid" });
    }

    certificate.paymentStatus = "paid";
    await certificate.save();

    return res.json({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
