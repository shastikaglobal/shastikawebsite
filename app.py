from flask import Flask, render_template, send_from_directory, request, jsonify, session, redirect, url_for, abort
from pymongo import MongoClient
import os
import requests as http_requests

# ==============================
# APP CONFIG
# ==============================

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = os.getenv("FLASK_SECRET_KEY", "SHASTIKA_ADMIN_PANEL_KEY_2025")

# ==============================
# MONGODB CONNECTION
# ==============================

MONGO_URI = os.getenv("MONGO_URI")

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

@app.route("/widget/<path:filename>")
def widget_files(filename):
    return send_from_directory("widget", filename)

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

    if not session.get("admin"):
        return render_template("admin.html")

    return render_template("admin.html")

# ==============================
# ADMIN DATA APIs
# ==============================

@app.route("/admin/messages")
def admin_messages():

    if not session.get("admin"):
        return jsonify([]), 401

    msgs = contact_collection.find().sort("_id", -1)

    return jsonify([
        {
            "name": m.get("name"),
            "email": m.get("email"),
            "phone": m.get("phone"),
            "subject": m.get("subject"),
            "message": m.get("message")
        }
        for m in msgs
    ])

@app.route("/admin/enquiries")
def admin_enquiries():

    if not session.get("admin"):
        return jsonify([]), 401

    enqs = enquiry_collection.find().sort("_id", -1)

    return jsonify([
        {
            "product": e.get("product"),
            "name": e.get("name"),
            "country": e.get("country"),
            "phone": e.get("phone"),
            "email": e.get("email")
        }
        for e in enqs
    ])

# ==============================
# ADMIN LOGOUT
# ==============================

@app.route("/admin_logout")
def admin_logout():
    session.clear()
    return redirect(url_for("admin_panel"))

# ==============================
# CUSTOM 404 PAGE
# ==============================

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404 - Page Not Found</h1>", 404

# ==============================
# CHATBOT API
# ==============================

@app.route("/chatbot", methods=["GET","POST"])
def chatbot():

    # Browser open panna page show
    if request.method == "GET":
        return render_template("chatbot.html")

    # Chat message receive
    data = request.get_json()

    message = data.get("message")

    response = http_requests.post(
        "https://chatbot-e99e.onrender.com/chatbot",
        json={"message": message}
    )

    return jsonify(response.json())

# ==============================
# RUN SERVER
# ==============================

if __name__ == "__main__":
    app.run(debug=True)


