const mcQuestions = [
  {
    en: "A member asks for help with a feature you don't understand. What would you do?",
    vi: "Một thành viên cần giúp đỡ về tính năng bạn chưa hiểu. Bạn sẽ làm gì?",
    options: [
      "Guess an answer",
      "Ask another staff member",
      "Ignore the question",
      "Tell them to figure it out"
    ]
  },
  {
    en: "Two members are arguing. What is your first response?",
    vi: "Hai thành viên đang tranh cãi. Phản ứng đầu tiên của bạn là gì?",
    options: [
      "Take your friend's side",
      "Join the argument",
      "Stay neutral and calm the situation",
      "Punish both immediately"
    ]
  },
  {
    en: "Your friend breaks a server rule. What would you do?",
    vi: "Bạn của bạn vi phạm nội quy server. Bạn sẽ làm gì?",
    options: [
      "Ignore it",
      "Apply the same rules fairly",
      "Hide the evidence",
      "Publicly embarrass them"
    ]
  },
  {
    en: "What should guide a moderation decision?",
    vi: "Điều gì nên định hướng quyết định kiểm duyệt?",
    options: [
      "Personal feelings",
      "Popularity",
      "Rules and evidence",
      "Friendship"
    ]
  },
  {
    en: "How should staff handle private reports?",
    vi: "Nhân viên nên xử lý báo cáo riêng tư thế nào?",
    options: [
      "Share with friends",
      "Publish them",
      "Keep them confidential",
      "Use them as jokes"
    ]
  }
];

const tfQuestions = [
  {
    en: "Staff may punish members without checking the situation.",
    vi: "Nhân viên có thể phạt thành viên mà không cần kiểm tra tình huống."
  },
  {
    en: "Every member deserves to be treated respectfully.",
    vi: "Mọi thành viên đều xứng đáng được đối xử tôn trọng."
  },
  {
    en: "Private staff discussions should remain confidential.",
    vi: "Các cuộc thảo luận nội bộ cần được giữ bảo mật."
  },
  {
    en: "Staff permissions can be used for personal benefits.",
    vi: "Quyền hạn nhân viên có thể được dùng vì lợi ích cá nhân."
  },
  {
    en: "Reports should be reviewed fairly.",
    vi: "Báo cáo cần được xem xét công bằng."
  },
  {
    en: "Staff may ask others for help when unsure.",
    vi: "Nhân viên có thể nhờ người khác hỗ trợ khi chưa chắc chắn."
  }
];

const writtenQuestions = [
  {
    en: "A member becomes aggressive during an argument. How would you handle the situation?",
    vi: "Một thành viên trở nên nóng nảy trong cuộc tranh cãi. Bạn sẽ xử lý thế nào?"
  },
  {
    en: "You discover another staff member abusing their permissions. What would you do?",
    vi: "Bạn phát hiện nhân viên khác lạm dụng quyền hạn. Bạn sẽ làm gì?"
  },
  {
    en: "Why do you want to join KangelSP, and what can you contribute?",
    vi: "Tại sao bạn muốn tham gia KangelSP và bạn có thể đóng góp điều gì?"
  }
];

function renderMC() {
  document.getElementById("mcQuestions").innerHTML =
    mcQuestions.map((q, i) => `
      <article class="question-card">
        <h3>${i + 1}. ${q.en}</h3>
        <p class="question-vi">${q.vi}</p>
        <div class="options">
          ${q.options.map((option, j) => `
            <label class="option">
              <input type="radio" name="mc_${i + 1}" value="${j + 1}" required />
              <span>${option}</span>
            </label>
          `).join("")}
        </div>
      </article>
    `).join("");
}

function renderTF() {
  document.getElementById("tfQuestions").innerHTML =
    tfQuestions.map((q, i) => `
      <article class="question-card">
        <h3>${i + 1}. ${q.en}</h3>
        <p class="question-vi">${q.vi}</p>
        <div class="options">
          <label class="option">
            <input type="radio" name="tf_${i + 1}" value="true" required />
            <span>True / Đúng</span>
          </label>
          <label class="option">
            <input type="radio" name="tf_${i + 1}" value="false" required />
            <span>False / Sai</span>
          </label>
        </div>
      </article>
    `).join("");
}

function renderWritten() {
  document.getElementById("writtenQuestions").innerHTML =
    writtenQuestions.map((q, i) => `
      <article class="question-card">
        <h3>${i + 1}. ${q.en}</h3>
        <p class="question-vi">${q.vi}</p>
        <textarea
          name="written_${i + 1}"
          rows="5"
          maxlength="2500"
          required
          placeholder="Your answer..."
        ></textarea>
      </article>
    `).join("");
}

function collectApplication(form) {
  const data = new FormData(form);

  const multipleChoice = mcQuestions.map((_, i) => ({
    question: i + 1,
    answer: data.get(`mc_${i + 1}`)
  }));

  const trueFalse = tfQuestions.map((_, i) => ({
    question: i + 1,
    answer: data.get(`tf_${i + 1}`)
  }));

  const written = writtenQuestions.map((_, i) => ({
    question: i + 1,
    answer: data.get(`written_${i + 1}`).trim()
  }));

  return {
    application: "KangelSP Staff Application",
    submitted_at: new Date().toISOString(),
    applicant: {
      name: data.get("name").trim(),
      discord_id: data.get("discord_id").trim(),
      timezone: data.get("timezone").trim(),
      online_time: data.get("online_time").trim(),
      age: Number(data.get("age")),
      experience: data.get("experience").trim()
    },
    answers: {
      multiple_choice: multipleChoice,
      true_false: trueFalse,
      written
    },
    review: {
      status: "Pending",
      scoring: "Manual review",
      score: null,
      reviewer_notes: ""
    }
  };
}

function downloadApplication(application) {
  const blob = new Blob(
    [JSON.stringify(application, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download =
    `KangelSP-Application-${new Date().toISOString().slice(0, 10)}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderMC();
  renderTF();
  renderWritten();

  const form = document.getElementById("applicationForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const application = collectApplication(form);
    downloadApplication(application);

    document.getElementById("message").textContent =
      "Application downloaded! Send the JSON file privately to KangelSP staff.";
  });
});
