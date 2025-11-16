-- 神居雪场滑雪团 - 数据库 Schema
-- 简单、直接、无废话

-- 人员表
CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  ski_level VARCHAR(20) DEFAULT 'beginner',
  board_type VARCHAR(20) DEFAULT 'ski',        -- 'ski' (雙板) or 'snowboard' (單板)
  age_group VARCHAR(20) DEFAULT 'adult',       -- 'adult' (大人) or 'child' (小孩)
  equipment VARCHAR(20) DEFAULT 'rental',      -- 'own' (自備) or 'rental' (租借)
  is_admin BOOLEAN DEFAULT false,
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 公告表
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  author_id INT REFERENCES people(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 餐饮表
CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  restaurant VARCHAR(100) NOT NULL,
  meal_time TIMESTAMP NOT NULL,
  notes TEXT
);

-- 餐饮参与者（多对多）
CREATE TABLE meal_participants (
  meal_id INT REFERENCES meals(id) ON DELETE CASCADE,
  person_id INT REFERENCES people(id) ON DELETE CASCADE,
  PRIMARY KEY (meal_id, person_id)
);

-- 交通工具表
CREATE TABLE transport (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(100) NOT NULL,
  driver_id INT REFERENCES people(id) ON DELETE SET NULL,
  seats INT NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  departure_location VARCHAR(200) NOT NULL
);

-- 乘客表（多对多）
CREATE TABLE transport_passengers (
  transport_id INT REFERENCES transport(id) ON DELETE CASCADE,
  person_id INT REFERENCES people(id) ON DELETE CASCADE,
  PRIMARY KEY (transport_id, person_id)
);

-- 集合点表
CREATE TABLE meeting_points (
  id SERIAL PRIMARY KEY,
  location VARCHAR(200) NOT NULL,
  meeting_time TIMESTAMP NOT NULL,
  notes TEXT
);

-- 集合点确认（多对多）
CREATE TABLE meeting_confirmations (
  meeting_point_id INT REFERENCES meeting_points(id) ON DELETE CASCADE,
  person_id INT REFERENCES people(id) ON DELETE CASCADE,
  confirmed_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (meeting_point_id, person_id)
);

-- 任务表
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  assignee_id INT REFERENCES people(id) ON DELETE SET NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引（只在必要的地方）
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX idx_tasks_completed ON tasks(is_completed);
