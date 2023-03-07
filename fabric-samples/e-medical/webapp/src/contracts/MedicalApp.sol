// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

    contract MedicalApp {


        struct Patients {
            MedicalRecord[] medicalRecord;
            address[] DoctorPermit;
        }

        struct MedicalRecord{
            string datetime;
            string info;
        }

        address public manager;
        mapping (address => Patients) patients;
        
        modifier restricted() {
            require(msg.sender == manager);
            _;
        }

        function getMedical(address patient_address) public view returns (Patients memory) {
            bool check = false;
            for(uint i = 0; i < patients[patient_address].DoctorPermit.length; i++){
                if(patients[patient_address].DoctorPermit[i] == msg.sender){
                    check = true;
                }
            }
            if(check == true){
                return (patients[patient_address]);
            }else{
                return (patients[manager]);
            }
            
        }

        function regDoctorPermit(address doctor_address) public payable returns (bool){
            bool check = false;
            for(uint i = 0; i < patients[msg.sender].DoctorPermit.length; i++){
                if(patients[msg.sender].DoctorPermit[i] == doctor_address){
                    check = true;
                }
            }
            if(check == true){
                return false;
            }else{
                patients[msg.sender].DoctorPermit.push(doctor_address);
                return true;
            }
        }

        function createMedicalRecord(address patient_address,string memory datetime,string memory info) public returns (bool) {
            bool check = false;
            for(uint i = 0; i < patients[patient_address].DoctorPermit.length; i++){
                if(patients[patient_address].DoctorPermit[i] == msg.sender){
                    check = true;
                }
            }
            if(check == true){
                MedicalRecord memory newMedicalRecord = MedicalRecord(datetime, info);
                patients[patient_address].medicalRecord.push(newMedicalRecord);
                return true;
            }else{
                return false;
            }
        }

    }