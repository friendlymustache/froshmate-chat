# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150806095606) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "college_students", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "auth_token"
    t.string   "fb_user_id"
    t.integer  "high_school_id"
    t.integer  "college_id"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.boolean  "admin",             default: false
    t.string   "confirmation_code"
    t.boolean  "confirmed",         default: false
  end

  create_table "colleges", force: :cascade do |t|
    t.string "name"
  end

  create_table "conversations", force: :cascade do |t|
    t.boolean  "active",             default: true
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.integer  "high_schooler_id"
    t.integer  "college_student_id"
    t.integer  "target_college_id"
  end

  create_table "high_school", force: :cascade do |t|
    t.string "name"
  end

  create_table "high_schoolers", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "auth_token"
    t.string   "fb_user_id"
    t.integer  "high_school_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "high_school_name"
  end

  create_table "mentor_requests", force: :cascade do |t|
    t.integer  "priority"
    t.integer  "target_college_id"
    t.string   "intended_major"
    t.string   "activities"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "messages", force: :cascade do |t|
    t.integer  "sender_id"
    t.integer  "recipient_id"
    t.integer  "conversation_id"
    t.string   "text"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.boolean  "sent_by_high_schooler"
  end

  create_table "profiles", force: :cascade do |t|
    t.integer  "sat"
    t.float    "gpa"
    t.integer  "ethnicity_id"
    t.integer  "gender_id"
    t.float    "class_rank"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "target_colleges", force: :cascade do |t|
    t.integer "high_schooler_id"
    t.integer "college_id"
  end

end
