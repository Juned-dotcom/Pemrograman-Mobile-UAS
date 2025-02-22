<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

include "db_config.php";
$postjson = json_decode(file_get_contents('php://input'), true);
$aksi = strip_tags($postjson['aksi']);
$data = array();

switch($aksi)
{
    case "addpesanan":
        $buyer_name = $postjson['buyer_name'];
        $buyer_phone = $postjson['buyer_phone'];
        $delivery_address = $postjson['delivery_address'];
        $product_info = $postjson['product_info'];
        $product_quantity = $postjson['product_quantity'];
        $product_image = $postjson['product_image'];
        $status = $postjson['status'];


        try {
            $sql = "INSERT INTO pesanan (buyer_name, buyer_phone, delivery_address, product_info, product_quantity, product_image, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$buyer_name, $buyer_phone, $delivery_address, $product_info, $product_quantity, $product_image, $status]);


            echo json_encode(array('success' => true, 'msg' => 'Booking successful'));
        } catch (PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
        break;

    case "getPesanan":
        try {
            $sql = "SELECT * FROM pesanan ORDER BY id DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);


            if ($stmt) {
                $result = json_encode(array('success' => true, 'result' => $rows));
            } else {
                $result = json_encode(array('success' => false, 'msg' => 'No data found'));
            }
            echo $result;
        } catch(PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
        break;

    case "searchPesanan":
        try {
            $sql = "SELECT * FROM pesanan WHERE buyer_name LIKE?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$postjson['searchTerm']]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(array('success' => true, 'result' => $rows));
        } catch(PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
        break;


    case "register":

        try {
            $username = filter_var($postjson['username'], FILTER_SANITIZE_STRING);
            $password = filter_var($postjson['password'], FILTER_SANITIZE_STRING);
            $fullName = filter_var($postjson['fullName'], FILTER_SANITIZE_STRING);
            
            // Cek apakah username sudah ada
            $sql_check = "SELECT COUNT(*) FROM users WHERE username = :username";
            $stmt_check = $pdo->prepare($sql_check);
            $stmt_check->bindParam(':username', $username);
            $stmt_check->execute();
            
            if ($stmt_check->fetchColumn() > 0) {
                echo json_encode(array('success' => false, 'msg' => 'Username sudah digunakan'));
                return;
            }
            
            // Perbaiki nama kolom dari full_name menjadi nama_lengkap
            $sql = "INSERT INTO users (username, password, nama_lengkap) VALUES (:username, :password, :full_name)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':full_name', $fullName);
            $stmt->execute();
            
            if ($stmt) {
                echo json_encode(array('success' => true));
            } else {
                echo json_encode(array('success' => false, 'msg' => 'Gagal mendaftar'));
            }
        } catch(PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
    break;

    case "login":
        try {
            $username = filter_var($postjson['username'], FILTER_SANITIZE_STRING);
            $password = filter_var($postjson['password'], FILTER_SANITIZE_STRING);
            
            $sql = "SELECT * FROM users WHERE username = :username AND password = :password";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                echo json_encode(array(
                    'success' => true,
                    'user' => array(
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'nama_lengkap' => $user['nama_lengkap']
                    )
                ));
            } else {
                echo json_encode(array('success' => false, 'msg' => 'Username atau password salah'));
            }
        } catch(PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
    break;

    case "add_order":
        try {
            $product_info = filter_var($postjson['productInfo'], FILTER_SANITIZE_STRING);
            $buyer_name = filter_var($postjson['buyerName'], FILTER_SANITIZE_STRING);
            $buyer_email = filter_var($postjson['buyerEmail'], FILTER_SANITIZE_EMAIL);
            $buyer_phone = filter_var($postjson['buyerPhone'], FILTER_SANITIZE_STRING);
            $status = 1; // Status awal
            $order_date = date('Y-m-d H:i:s');
            
            $sql = "INSERT INTO orders (product_info, buyer_name, buyer_email, buyer_phone, status, order_date) 
                    VALUES (:product_info, :buyer_name, :buyer_email, :buyer_phone, :status, :order_date)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':product_info', $product_info);
            $stmt->bindParam(':buyer_name', $buyer_name);
            $stmt->bindParam(':buyer_email', $buyer_email);
            $stmt->bindParam(':buyer_phone', $buyer_phone);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':order_date', $order_date);
            $stmt->execute();
            
            if ($stmt) {
                echo json_encode(array('success' => true));
            } else {
                echo json_encode(array('success' => false, 'msg' => 'Gagal menambah pesanan'));
            }
        } catch(PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
    break;

    case "get_orders":
        try {
            $sql = "SELECT * FROM orders ORDER BY order_date DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if ($orders) {
                echo json_encode(array('success' => true, 'result' => $orders));
            } else {
                echo json_encode(array('success' => false, 'msg' => 'Tidak ada pesanan'));
            }
        } catch(PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
    break;

    case "update_order_status":
        try {
            $order_id = filter_var($postjson['orderId'], FILTER_SANITIZE_NUMBER_INT);
            $status = filter_var($postjson['status'], FILTER_SANITIZE_NUMBER_INT);
            
            $sql = "UPDATE orders SET status = :status WHERE id = :order_id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':order_id', $order_id);
            $stmt->execute();
            
            if ($stmt) {
                echo json_encode(array('success' => true));
            } else {
                echo json_encode(array('success' => false, 'msg' => 'Gagal update status'));
            }
        } catch(PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
    break;

    case "updateStatus":
        try {
            $id = $postjson['id'];
            $status = $postjson['status'];
            
            $sql = "UPDATE pesanan SET status = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$status, $id]);
            
            if ($stmt) {
                echo json_encode(array('success' => true, 'msg' => 'Status berhasil diupdate'));
            } else {
                echo json_encode(array('success' => false, 'msg' => 'Gagal mengupdate status'));
            }
        } catch(PDOException $e) {
            echo json_encode(array('success' => false, 'msg' => $e->getMessage()));
        }
        break;
}
