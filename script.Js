document.addEventListener('DOMContentLoaded', function() {
    const salesForm = document.getElementById('proSalesForm');
    const totalBillInput = document.getElementById('totalBill');
    const paidAmountInput = document.getElementById('paidAmount');
    const displayDue = document.getElementById('displayDue');
    const fileInput = document.getElementById('fileInput');

    // বাকি টাকা অটোমেটিক ক্যালকুলেশন করার ফাংশন
    function calculateDue() {
        const total = parseFloat(totalBillInput.value) || 0;
        const paid = parseFloat(paidAmountInput.value) || 0;
        const due = total - paid;
        
        // বাংলা ফরম্যাটে টাকা দেখানো
        displayDue.innerText = "৳ " + due.toLocaleString('bn-BD');
        
        // বাকি থাকলে লাল, শোধ হলে সবুজ রঙ
        if(due > 0) {
            displayDue.style.color = "#c62828";
        } else {
            displayDue.style.color = "#2e7d32";
        }
    }

    totalBillInput.addEventListener('input', calculateDue);
    paidAmountInput.addEventListener('input', calculateDue);

    // ছবিকে গুগল স্ক্রিপ্টে পাঠানোর উপযোগী করার ফাংশন
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
                bytes: Array.from(new Uint8Array(reader.result)),
                contentType: file.type,
                fileName: file.name
            });
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // ফর্ম সাবমিট করার মূল কাজ
    salesForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> ডাটা পাঠানো হচ্ছে...';

        // আপনার দেওয়া সেই Web App URL
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbzxdDBuMMnUf9Aj2rs62qZRRTp_8FcCXTWMuMn59sIZUE55ATg_8Zo8KMcqC1qocSqB/exec';

        // ছবি প্রসেস করা
        const file = fileInput.files[0];
        let fileJson = JSON.stringify({bytes: [], contentType: '', fileName: ''});
        
        if (file) {
            try {
                const fileData = await readFile(file);
                fileJson = JSON.stringify(fileData);
            } catch (err) {
                console.error("ছবি প্রসেস করতে সমস্যা হয়েছে:", err);
            }
        }

        // ফর্মের সব তথ্য গুছিয়ে নেওয়া
        const params = new URLSearchParams({
            customerName: document.getElementById('customerName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            quantity: document.getElementById('quantity').value,
            totalBill: document.getElementById('totalBill').value,
            paidAmount: document.getElementById('paidAmount').value,
            sellerName: document.getElementById('sellerName').value
        });

        // গুগল শিটে ডেটা পাঠানো শুরু
        fetch(`${webAppUrl}?${params.toString()}`, {
            method: 'POST',
            body: fileJson
        })
        .then(res => res.text())
        .then(data => {
            if(data === "Success") {
                // সফল হলে মেসেজ দেখানো
                salesForm.style.display = 'none';
                document.getElementById('success').style.display = 'block';
                alert("✅ অভিনন্দন! রিপোর্ট এবং ছবি গুগল শিটে সেভ হয়েছে।");
            } else {
                alert("সার্ভার থেকে রিপ্লাই আসেনি। আবার চেষ্টা করুন।");
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'রিপোর্ট সাবমিট করুন';
            }
        })
        .catch(err => {
            console.error("Error:", err);
            alert("দুঃখিত, কোনো সমস্যা হয়েছে। ইন্টারেনেট কানেকশন চেক করুন।");
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'রিপোর্ট সাবমিট করুন';
        });
    });
});
