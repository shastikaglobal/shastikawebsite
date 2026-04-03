
from flask import Flask, render_template, send_from_directory, request, jsonify, session, redirect, url_for, abort
from pymongo import MongoClient
import os

# ==============================
# APP CONFIG
# ==============================

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = os.getenv("FLASK_SECRET_KEY", "SHASTIKA_ADMIN_PANEL_KEY_2025")

# ==============================
# MONGODB CONNECTION
# ==============================

MONGO_URI = "mongodb+srv://shastikaAdmin:Shastika2026@cluster0.wfhd0hm.mongodb.net/shastikaDB?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)

try:
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully")
except Exception as e:
    print("❌ MongoDB Connection Failed:", e)

db = client["shastikaDB"]
contact_collection = db["contact_messages"]
enquiry_collection = db["product_enquiries"]

# ==============================
# WEBSITE ROUTES
# ==============================

@app.route("/")
def final():
    return render_template("home.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/products")
def products():
    return render_template("products.html")

@app.route("/countries")
def countries():
    return render_template("countries.html")

@app.route('/widget/<path:filename>')
def widget_files(filename):
    return send_from_directory('widget', filename)

@app.route("/awards")
def awards():
    return render_template("awards.html")

@app.route("/team")
def team():
    return render_template("team.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/location")
def location():
    return render_template("location.html")

@app.route("/gallery")
def gallery():
    return render_template("gallery.html")

# ==============================
# DYNAMIC PRODUCT PAGES
# ==============================

@app.route("/product/<product_name>")
def product_page(product_name):
    try:
        return render_template(f"products/{product_name}.html")
    except:
        abort(404)

# ==============================
# CONTACT FORM API
# ==============================

@app.route("/submit_contact", methods=["POST"])
def submit_contact():
    data = request.json
    contact_collection.insert_one({
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "subject": data.get("subject"),
        "message": data.get("message")
    })
    return jsonify({"status": "success"})

# ==============================
# PRODUCT ENQUIRY API
# ==============================

@app.route("/submit_enquiry", methods=["POST"])
def submit_enquiry():
    data = request.json
    enquiry_collection.insert_one({
        "product": data.get("product"),
        "name": data.get("name"),
        "country": data.get("country"),
        "phone": data.get("phone"),
        "email": data.get("email")
    })
    return jsonify({"status": "success"})

# ==============================
# ADMIN LOGIN
# ==============================

@app.route("/admin_login", methods=["POST"])
def admin_login():
    data = request.json
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@shastika.com")
    ADMIN_PASS = os.getenv("ADMIN_PASS", "Admin@123")
    if data.get("email") == ADMIN_EMAIL and data.get("password") == ADMIN_PASS:
        session["admin"] = True
        return jsonify({"status": "ok"})
    return jsonify({"status": "fail"}), 401

# ==============================
# ADMIN PANEL
# ==============================

@app.route("/admin")
def admin_panel():
    return render_template("admin.html")

@app.route("/admin/messages")
def admin_messages():
    if not session.get("admin"):
        return jsonify([]), 401
    msgs = contact_collection.find().sort("_id", -1)
    return jsonify([
        {"name": m.get("name"), "email": m.get("email"), "phone": m.get("phone"),
         "subject": m.get("subject"), "message": m.get("message")}
        for m in msgs
    ])

@app.route("/admin/enquiries")
def admin_enquiries():
    if not session.get("admin"):
        return jsonify([]), 401
    enqs = enquiry_collection.find().sort("_id", -1)
    return jsonify([
        {"product": e.get("product"), "name": e.get("name"), "country": e.get("country"),
         "phone": e.get("phone"), "email": e.get("email")}
        for e in enqs
    ])

@app.route("/admin_logout")
def admin_logout():
    session.clear()
    return redirect(url_for("admin_panel"))

# ==============================
# CUSTOM 404
# ==============================

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404 - Page Not Found</h1>", 404

# ==============================
# CHATBOT API
# ==============================

# ==============================
# CHATBOT RESPONSES
# ==============================

CHATBOT_DATA = {
    "en": {
        "welcome": "Welcome to Shastika! 🌿 How can I help you today?",
        "options": [
            "📦 Our Products",
            "🌍 Export Services",
            "💰 Get Quote",
            "📞 Contact Us"
        ]
    },
    "fr": {
        "welcome": "Bienvenue chez Shastika! 🌿 Comment puis-je vous aider?",
        "options": ["📦 Nos Produits", "🌍 Services d'Exportation", "💰 Obtenir un Devis", "📞 Nous Contacter"]
    }
}

PRODUCTS_INFO = {
    "coconut": "We offer premium coconuts: Tender Coconut, Green Coconut, and Dehusked Coconut. All organic and fresh!",
    "banana": "Our bananas include Cavendish, Red Banana, Baby Banana, and Nendran varieties - perfect for export.",
    "watermelon": "Premium watermelons and black watermelons - fresh and delicious, ready for global markets.",
    "tomato": "Farm-fresh tomatoes grown using sustainable methods.",
    "pumpkin": "White Pumpkin and Yellow Pumpkin - nutritious and versatile.",
    "cucumber": "Yellow cucumbers - fresh and crunchy.",
    "quote": "Please fill in the quotation form to get a price estimate.",
    "export": "We handle international export to multiple countries. Let's discuss your requirements!",
    "contact": "You can reach us via email, phone, or through our contact form."
}

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/", methods=["GET"])
def chatbot_welcome():
    lang = request.args.get("lang", "en")
    data = CHATBOT_DATA.get(lang, CHATBOT_DATA["en"])
    return jsonify(data)

@app.route("/chat", methods=["POST"])
def chatbot_message():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").lower()
    lang = data.get("lang", "en")
    
    # Simple keyword matching to generate responses
    response = "Thank you for your message! How else can I help you?"
    
    if any(word in user_message for word in ["coconut", "tender", "green", "husked"]):
        response = PRODUCTS_INFO.get("coconut", "")
    elif any(word in user_message for word in ["banana", "cavendish", "red", "nendran"]):
        response = PRODUCTS_INFO.get("banana", "")
    elif any(word in user_message for word in ["watermelon"]):
        response = PRODUCTS_INFO.get("watermelon", "")
    elif any(word in user_message for word in ["tomato"]):
        response = PRODUCTS_INFO.get("tomato", "")
    elif any(word in user_message for word in ["pumpkin", "cucumber"]):
        response = PRODUCTS_INFO.get("pumpkin", "")
    elif any(word in user_message for word in ["quote", "price", "quotation"]):
        response = PRODUCTS_INFO.get("quote", "")
        return jsonify({"response": response, "reply": "SHOW_QUOTE_FORM"})
    elif any(word in user_message for word in ["export", "international"]):
        response = PRODUCTS_INFO.get("export", "")
    elif any(word in user_message for word in ["contact", "phone", "email"]):
        response = PRODUCTS_INFO.get("contact", "")
    
    return jsonify({"response": response, "reply": response})

@app.route("/contact-submit", methods=["POST"])
def contact_submit():
    data = request.get_json(silent=True) or {}
    contact_collection.insert_one({
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "message": data.get("message", "")
    })
    return jsonify({"status": "success", "message": "Thank you! We'll contact you soon."})

@app.route("/quote-submit", methods=["POST"])
def quote_submit():
    data = request.get_json(silent=True) or {}
    enquiry_collection.insert_one({
        "company": data.get("company"),
        "product": data.get("product"),
        "quantity": data.get("quantity"),
        "destination": data.get("destination"),
        "phone": data.get("phone"),
        "whatsapp": data.get("whatsapp"),
        "timestamp": os.popen("date").read()
    })
    return jsonify({"status": "success", "message": "Quote request submitted!"})

# ==============================
# RUN SERVER
# ==============================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)

EOF

