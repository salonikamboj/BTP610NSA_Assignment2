import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import CheckBox from "expo-checkbox";

const CourierRateApp = () => {
  const [sendingAddress, setSendingAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const radioOptions = ["Package", "Letter or Document"];
  const parcelRateOptions = ["Standard", "Xpress", "Priority"];
  const [parcelType, setParcelType] = useState("");
  const [parcelWeight, setParcelWeight] = useState("");
  const [rate, setRate] = useState("");
  const [signatureOption, setSignatureOption] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getRateValue = () => {
    const rateMap = {
      Package: { Standard: 12.99, Xpress: 18.99, Priority: 24.99 },
      Letter: { Standard: 4.99, Xpress: 9.99, Priority: 14.99 },
    };
    if (parcelType === "Package") return rateMap.Package[rate];
    return rateMap.Letter[rate];
  };

  const validateAndCalculate = () => {
    if (
      !sendingAddress ||
      !destinationAddress ||
      !parcelType ||
      !parcelWeight ||
      !rate
    ) {
      Alert.alert("Missing Info", "All fields are required.", [{ text: "OK" }]);
      return;
    }

    const weight = parseFloat(parcelWeight);
    if (isNaN(weight)) {
      Alert.alert("Invalid Input", "Weight must be a valid number.", [
        { text: "OK" },
      ]);
      return;
    }

    if (
      (parcelType === "Package" && weight > 44) ||
      (parcelType !== "Package" && weight > 1.1)
    ) {
      const limitMessage =
        parcelType === "Package"
          ? "Package: up to 44 lbs allowed."
          : "Letter or Document: up to 1.1 lb allowed.";

      Alert.alert("Weight Limit Exceeded", limitMessage, [{ text: "OK" }]);
      return;
    }

    setModalVisible(true);
  };

  const rateValue = getRateValue();
  const addOnCost = signatureOption ? 2 : 0;
  const subTotal = rateValue + addOnCost;
  const tax = subTotal * 0.13;
  const total = subTotal + tax;

  return (
    <ScrollView>
      <Text style={styles.title}>Parcel Rate Calculator</Text>
      <Text style={styles.label}> Enter addresses:</Text>
      <TextInput
        style={styles.input}
        placeholder="Sending Address"
        onChangeText={setSendingAddress}
        keyboardType="default"
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={20}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination Address"
        onChangeText={setDestinationAddress}
        keyboardType="default"
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={20}
      />

      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={styles.label}> Select Package Type:</Text>
      </View>
      <View style={{ alignItems: "flex-start" }}>
        {radioOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.radioContainer}
            onPress={() => setParcelType(option)}
          >
            <View style={styles.radioCircle}>
              {parcelType === option && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Parcel Weight (lbs)"
        keyboardType="numeric"
        onChangeText={setParcelWeight}
      />

      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={styles.label}> Choose Rate:</Text>
      </View>
      <View style={{ alignItems: "flex-start" }}>
        {parcelRateOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.radioContainer}
            onPress={() => setRate(option)}
          >
            <View style={styles.radioCircle}>
              {rate === option && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.checkBoxContainer}>
        <CheckBox
          value={signatureOption}
          onValueChange={setSignatureOption}
          tintColors={{ true: "#000", false: "#aaa" }}
        />
        <Text style={styles.checkBoxLabel}>Add Signature Option (+$2)</Text>
      </View>

      <TouchableOpacity onPress={validateAndCalculate} style={styles.button}>
        <Text style={styles.buttonText}>Get Rate</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Order Summary</Text>
            <Text>From: {sendingAddress}</Text>
            <Text>To: {destinationAddress}</Text>
            <Text>Type: {parcelType}</Text>
            <Text>Weight: {parcelWeight} lbs</Text>
            <Text>
              Rate: {rate}: ${rateValue}
            </Text>
            {signatureOption && <Text>Signature Add-On: $2.00</Text>}
            <Text>Sub Total: ${subTotal.toFixed(2)}</Text>
            <Text>Tax (13%): ${tax.toFixed(2)}</Text>
            <Text>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  label: {
    fontWeight: "semibold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "teal",
  },

  radioLabel: {
    fontSize: 16,
  },

  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  checkBoxLabel: {
    fontSize: 16,
    marginLeft: 20,
  },
  button: {
    borderRadius: 5,
    borderColor: "pink",
    alignSelf: "center",
    backgroundColor: "green",
    width: 70,
    padding: 10,
    marginTop: 20,
  },
  buttonText: { color: "white", textAlign: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000aa",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
});

export default CourierRateApp;
